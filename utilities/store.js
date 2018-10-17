import "isomorphic-unfetch"
import { ASSET_URL } from "../constants"

let store = null

export function getStore() {
  return store
}

export async function fetchMeta() {
  if (store) return store

  try {
    const response = await fetch(ASSET_URL + "/content.json")
    const nextStore = await response.json()
    store = Object.assign({}, store, nextStore)
  } catch (error) {
    store = { error }
  }

  return store
}

export async function fetchContentById(id) {
  if (!id) return
  if (!store) await fetchMeta()
  if (!store.metadata) return {}

  const existing = store.metadata.find(item => item.id === id)
  if (!existing) return null
  if (existing.content) return existing

  const root = ASSET_URL + existing.contentRoot
  const res = await fetch(root + "/metadata.json")
  const metadata = await res.json()

  switch (metadata.contentType) {
    case "article":
      const README = await fetch(root + "/README.md")
      const content = await README.text()
      return Object.assign(metadata, { content })
    case "gallery":
      return Object.assign(metadata, { root })
    default:
      return metadata
  }
}

export async function getError() {
  if (!store) await fetchMeta()
  return store.error
}
