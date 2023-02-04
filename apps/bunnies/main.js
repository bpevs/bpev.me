// deno run --allow-read --allow-net main.js

// @deno-types="https://deno.land/x/esbuild@v0.14.51/mod.d.ts"
import * as esbuildWasm from "esbuild/wasm.js";
import * as esbuildNative from "esbuild/mod.js";

// @ts-ignore
const esbuild = Deno.run === undefined ? esbuildWasm : esbuildNative;

import { serve } from '$std/http/server.ts'
import { dirname, fromFileUrl, join, resolve } from '$std/path/mod.ts'
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
