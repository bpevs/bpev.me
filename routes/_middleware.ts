import { MiddlewareHandlerContext, Request } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export const handler = [
  logging,
];

async function logging(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  const res = await ctx.next();
  if (!/(_frsh|static)/.test(req.url)) {
    console.log(`${req.method} ${req.url} ${res.status}`);
  }
  return res;
}

async function auth(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  if (new Regexp("(\/edit|/\/dashboard)").test(req.url)) {
    const isAllowed = getCookies(req.headers).auth === "bar";
    if (!isAllowed) {
      const url = new URL(req.url);
      url.pathname = "/dashboard";
      return Response.redirect(url, 307);
    }
  }
  return ctx.next();
}