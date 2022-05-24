// deno run --allow-read --allow-net main.js

import { parse } from "https://deno.land/std@0.140.0/encoding/yaml.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { join } from "https://deno.land/std@0.140.0/path/mod.ts";

const urls = parse(
  await Deno.readTextFile(join(import.meta.url, "sites.yaml")),
);
serve((req) => Response.redirect(urls[new URL(req.url).pathname] || urls[404]));
