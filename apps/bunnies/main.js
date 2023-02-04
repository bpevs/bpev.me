// deno run --allow-read --allow-net main.js
import { serve } from '$std/http/server.ts'
import { dirname, fromFileUrl, join, resolve } from '$std/path/mod.ts'
import * as esbuild from 'esbuild';
import { denoPlugin } from 'esbuild_deno_loader';
let importMapURL = new URL('file://' + resolve('./import_map.json'));

let { port, host, wait } = await esbuild.serve(
  { servedir: './' }, {
  entryPoints: ['source/index.js'],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
  treeShaking: true,
  plugins: [denoPlugin({ importMapURL })]
});

console.log(host, port);
await wait;
