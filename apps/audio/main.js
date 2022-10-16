// deno run --allow-read --allow-net main.js

import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {
  dirname,
  fromFileUrl,
  join
} from "https://deno.land/std@0.140.0/path/mod.ts";


async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/icon")) {
    const filePath = join(dirname(fromFileUrl(import.meta.url)), pathname);
    const file = await Deno.readFile(filePath);
    return new Response(file);
  }

  const index = join(dirname(fromFileUrl(import.meta.url)), "index.html");
  const indexHTML = new Response((await Deno.open(index, { read: true })).readable);

  return indexHTML;
}

serve(handleRequest);
