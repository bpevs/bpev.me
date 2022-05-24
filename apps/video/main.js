// Static server that always responds with index.html
// deno run --allow-read --allow-net main.js

import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

serve(async () =>
  new Response((await Deno.open("./index.html", { read: true })).readable)
);
