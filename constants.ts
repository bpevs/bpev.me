import "$std/dotenv/load.ts";
import { parse } from "$std/flags/mod.ts";

export const isDev = parse(Deno.args).env === "DEVELOPMENT";
export const isProd = parse(Deno.args).env === "PRODUCTION";

export const AUTH_KEY = Deno.env.get("AUTH_KEY");
export const B2_KEY_ID = Deno.env.get("B2_KEY_ID");
export const B2_KEY_NAME = Deno.env.get("B2_KEY_NAME");
export const B2_APPLICATION_KEY = Deno.env.get("B2_APPLICATION_KEY");

export const B2_BLOG_BUCKET_ID = Deno.env.get("B2_BUCKET_ID_BLOG");
export const B2_STATIC_BUCKET_ID = Deno.env.get("B2_BUCKET_ID_STATIC");

export const BLOG_ROOT = isProd
  ? Deno.env.get("URL.BLOG")
  : "file://Users/ben/desktop/notes";

const FEATURE: {
  B2: boolean;
  DASHBOARD: boolean;
} = {
  B2: true,
  DASHBOARD: true,
};

Object.keys(FEATURE).forEach((key) => {
  const value = Deno.env.get(`FEATURE_${key}`);
  if (typeof value === "boolean") FEATURE[key] = value;
  else if (value.toLowerCase() === "true") FEATURE[key] = true;
  else if (value.toLowerCase() === "false") FEATURE[key] = false;
});

Object.freeze(FEATURE);
export { FEATURE };