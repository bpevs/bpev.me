import "$std/dotenv/load.ts";

export const KEY_ID = Deno.env.get("KEY_ID");
export const KEY_NAME = Deno.env.get("KEY_NAME");
export const APPLICATION_KEY = Deno.env.get("APPLICATION_KEY");

export const BLOG_BUCKET_ID = Deno.env.get("BLOG_BUCKET_ID");
export const STATIC_BUCKET_ID = Deno.env.get("STATIC_BUCKET_ID");

export const BLOG_ROOT = true
  ? Deno.env.get("BLOG_URL")
  : "http://localhost:3001/";
