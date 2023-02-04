import { v1 } from '$std/uuid/mod.ts'
import { getCookies } from '$std/http/cookie.ts'

const store = new Set()

export default store

export function createSessionId() {
  const id = v1.generate()
  store.add(id)
  return id.toString()
}
export function hasSessionId(id: string) {
  return store.has(id)
}
export function deleteSessionId(id: string) {
  return store.delete(id)
}

export function isAuthorized(req: Request) {
  return hasSessionId(getCookies(req.headers)?.auth)
}
