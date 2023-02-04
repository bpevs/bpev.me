// deno run --allow-read --allow-net main.js
import { serve } from '$std/http/server.ts'
import {
  dirname,
  fromFileUrl,
  join,
  resolve,
  toFileUrl,
} from '$std/path/mod.ts'
// @deno-types="https://deno.land/x/esbuild@v0.14.51/mod.d.ts"
import * as esbuildWasm from "https://deno.land/x/esbuild@v0.14.51/wasm.js";
import * as esbuildNative from "https://deno.land/x/esbuild@v0.14.51/mod.js";
// @ts-ignore trust me
const esbuild: typeof esbuildWasm = Deno.run === undefined
  ? esbuildWasm
  : esbuildNative;
import { denoPlugin } from "https://deno.land/x/esbuild_deno_loader@0.5.2/mod.ts";

// @ts-ignore
const importMapURL = new URL('file://' + resolve('./import_map.json'))
const absWorkingDir = Deno.cwd()
const cache = new Map()
const absDirUrlLength = toFileUrl(absWorkingDir).href.length

let esbuildInitialized: boolean | Promise<void> = false

await ensureEsbuildInitialized()

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

async function ensureEsbuildInitialized() {
  if (esbuildInitialized === false) {
    if (Deno.run === undefined) {
      const wasmURL = new URL('./esbuild_v0.14.51.wasm', import.meta.url).href
      esbuildInitialized = fetch(wasmURL).then(async (r) => {
        const headers = { 'Content-Type': 'application/wasm' }
        const resp = new Response(r.body, { headers })
        const wasmModule = await WebAssembly.compileStreaming(resp)
        await esbuild.initialize({ wasmModule, worker: false })
      })
    } else {
      esbuild.initialize({})
    }
    await esbuildInitialized
    esbuildInitialized = true
  } else if (esbuildInitialized instanceof Promise) {
    await esbuildInitialized
  }
}
