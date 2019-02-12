import { get } from "@civility/utilities"

export const ASSET_URL = get(process, [ "env", "ASSET_URL" ]) || "https://static.bpev.me"

export const CONTENT_TYPE = {
  ARTICLE: "article",
  GALLERY: "gallery",
}
