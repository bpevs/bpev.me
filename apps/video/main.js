// deno run --allow-read --allow-net main.js

import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { join } from "https://deno.land/std@0.140.0/path/mod.ts";

const index = join(import.meta.url, "index.html");

serve(async () =>
  new Response((await Deno.open(index, { read: true })).readable)
);
