import { Handlers } from '$fresh/server.ts'
import { deleteCookie, getCookies } from '$std/http/cookie.ts'
import { deleteSessionId } from '@/utilities/session.ts'

export const handler: Handlers = {
  GET(req) {
    const domain = (new URL(req.url)).hostname
    const headers = new Headers(req.headers)
    deleteSessionId(getCookies(headers).auth)
    deleteCookie(headers, 'auth', { path: '/', domain })
    headers.set('location', '/')
    return new Response(null, { status: 302, headers })
  },
}
