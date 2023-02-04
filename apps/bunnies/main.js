// deno run --allow-read --allow-net main.js
import { serve } from '$std/http/server.ts'
import {
  dirname,
  fromFileUrl,
  join,
  resolve,
  toFileUrl,
} from '$std/path/mod.ts'

import { denoPlugin } from 'esbuild_deno_loader'
import * as esbuild from 'esbuild/mod.js'

// @ts-ignore
let importMapURL = new URL('file://' + resolve('./import_map.json'))

let bundle = await esbuild.build({
  entryPoints: ['source/index.js'],
  outdir: 'dist',
  format: 'esm',
  metafile: true,
  bundle: true,
  treeShaking: true,
  splitting: true,
  write: false,
  target: ['chrome99', 'firefox99', 'safari15'],
  plugins: [denoPlugin({ importMapURL })],
})

const absWorkingDir = Deno.cwd()
const cache = new Map()
const absDirUrlLength = toFileUrl(absWorkingDir).href.length
for (const file of bundle.outputFiles) {
  cache.set(
    toFileUrl(file.path).href.substring(absDirUrlLength),
    new TextDecoder().decode(file.contents),
  )
}

const root = dirname(fromFileUrl(import.meta.url))
const index = join(root, 'index.html')
const jsHeader = { 'content-type': 'text/javascript; charset=utf-8' }
serve(async (request) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url).pathname)
    const filepath = (pathname === '/') ? index : join(root, '.' + pathname)
    const js = cache.get(filepath.replace(root, ''))
    if (!js) {
      const file = (await Deno.open(filepath, { read: true })).readable
      return new Response(file)
    }
    return new Response(js, { headers: jsHeader })
  } catch {
    return new Response('404 Not Found', { status: 404 })
  }
})
