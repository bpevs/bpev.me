import { MiddlewareHandlerContext, Request } from "$fresh/server.ts";

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
