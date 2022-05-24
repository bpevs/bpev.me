// deno run --allow-read --allow-net main.js

import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.140.0/path/mod.ts";

const root = dirname(fromFileUrl(import.meta.url));
const index = join(root, "index.html");
const jsHeader = { "content-type": "text/javascript; charset=utf-8" };

serve(async (request) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url).pathname);
    const filepath = (pathname === "/") ? index : join(root, "." + pathname);
    const file = (await Deno.open(filepath, { read: true })).readable;
    return filepath.match("js")
      ? new Response(file, { headers: jsHeader })
      : new Response(file);
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
});
