import { MiddlewareHandlerContext as Context } from '$fresh/server.ts'
import { isAuthorized } from '@/utilities/session.ts'

export const handler = [
  logging,
  auth,
  redirect, // Must be after imageFetch
]

async function logging(req: Request, ctx: Context): Promise<Response> {
  const res = await ctx.next()
  if (!/(_frsh|static)/.test(req.url)) {
    console.log(`${req.method} ${req.url} ${res.status}`)
  }
  return res
}

function auth(req: Request, ctx: Context): Promise<Response> {
  if (new RegExp('(/edit|/new|/api/notes)').test(req.url)) {
    if (!isAuthorized(req)) {
      const url = new URL(req.url)
      url.pathname = '/dashboard'
      return Promise.resolve(Response.redirect(url, 307))
    }
  }
  return ctx.next()
}

function redirect(req: Request, ctx: Context): Promise<Response> {
  if (/blog/.test(req.url)) {
    const url = new URL(req.url)
    url.pathname = url.pathname.replace('blog', 'notes')
    return Promise.resolve(Response.redirect(url, 301))
  }
  return ctx.next()
}
