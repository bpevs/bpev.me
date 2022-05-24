// deno run --allow-read --allow-net main.js

import { parse } from "https://deno.land/std@0.140.0/encoding/yaml.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const urls = parse(await Deno.readTextFile("sites.yaml"));
serve((req) => Response.redirect(urls[new URL(req.url).pathname] || urls[404]));
