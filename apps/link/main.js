// deno run --allow-read --allow-net main.js

import { parse } from "https://deno.land/std@0.140.0/encoding/yaml.ts";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.140.0/path/mod.ts";

const urlsFilepath = join(dirname(fromFileUrl(import.meta.url)), "sites.yaml");
const urls = parse(await Deno.readTextFile(urlsFilepath));
serve((req) => Response.redirect(urls[new URL(req.url).pathname] || urls[404]));
