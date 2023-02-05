import { MiddlewareHandlerContext } from '$fresh/server.ts'
import { isAuthorized } from '@/utilities/session.ts'

export const handler = [
  logging,
  auth,
]

async function logging(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  const res = await ctx.next()
  if (!/(_frsh|static)/.test(req.url)) {
    console.log(`${req.method} ${req.url} ${res.status}`)
  }
  return res
}

function auth(
  req: Request,
  ctx: MiddlewareHandlerContext,
): Promise<Response> {
  if (new RegExp('(/edit|/new|/api/notes)').test(req.url)) {
    if (!isAuthorized(req)) {
      const url = new URL(req.url)
      url.pathname = '/dashboard'
      return Promise.resolve(Response.redirect(url, 307))
    }
  }
  return ctx.next()
}
