import { v1 } from '$std/uuid/mod.ts'
import { getCookies } from '$std/http/cookie.ts'
import store from '@/utilities/store.ts'

export async function createSessionId() {
  const id = v1.generate()
  await store.set(['sessions', id], true)
  return id.toString()
}
export async function hasSessionId(id: string) {
  if (!id) return false
  return Boolean((await store.get(['sessions', id])).value)
}

export function deleteSessionId(id: string) {
  return store.delete(['sessions', id])
}

export function isAuthorized(req: Request) {
  return hasSessionId(getCookies(req.headers)?.auth)
}
