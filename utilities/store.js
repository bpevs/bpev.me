import "isomorphic-unfetch";
import { ASSET_URL } from "../constants";

let store = null;

export function getStore() {
  return store;
}

export async function fetchMeta() {
  if (!store) {
    const response = await fetch(ASSET_URL + "/blog/content.json");
    store = Object.assign({}, store, await response.json());
  }

  return store;
}

export async function fetchContentById(id) {
  if (!store) await fetchMeta();

  const existing = store.metadata.find(item => item.id === id);
  if (!existing) return null;
  if (existing.content) return existing;

  const root = ASSET_URL + "/blog" + existing.contentRoot;
  const res = await fetch(root + "/metadata.json");
  const metadata = await res.json();

  if (metadata.contentType === "article") {
    const res = await fetch(root + "/README.md");
    const content = await res.text();
    metadata.content = content;
  } else if (metadata.contentType === "gallery") {
    const rootArr = root.split("/");
    metadata.root = root;
  }

  return metadata;
}
