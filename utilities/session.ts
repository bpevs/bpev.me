import { v1 } from '$std/uuid/mod.ts'
import { getCookies } from '$std/http/cookie.ts'

const store = await Deno.openKv()

export default store

export async function createSessionId() {
  const id = v1.generate()
  await store.set([id], true)
  return id.toString()
}
export async function hasSessionId(id: string) {
  if (!id) return false
  return Boolean((await store.get([id])).value)
}

export function deleteSessionId(id: string) {
  return store.delete([id])
}

export function isAuthorized(req: Request) {
  return hasSessionId(getCookies(req.headers)?.auth)
}
