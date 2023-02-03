import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req) {
    const domain = (new URL(req.url)).hostname;
    const headers = new Headers(req.headers);
    deleteCookie(headers, "auth", { path: "/", domain });
    headers.set("location", "/");
    return new Response(null, { status: 302, headers });
  },
};
