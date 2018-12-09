import { get } from "@civility/utilities"

export const ASSET_URL = get(process, [ "env", "ASSET_URL" ]) || "https://static.bpev.me"

export const CONTENT_TYPE = {
  ARTICLE: "article",
  GALLERY: "gallery",
}

// This is the public Firebase configuration. These keys are simply used for
// telling Firebase where our apis are located, and are not a security issue.
// Our Firebase security rules are what prevent shenanigans.
export const FIREBASE = {
  apiKey: "AIzaSyDVl8Tdzu8WdyqSoW7fd-FHujItUxTGW1M",
  authDomain: "open-acappella.firebaseapp.com",
  databaseURL: "https://open-acappella.firebaseio.com/",
  storageBucket: "gs://open-acappella.appspot.com",
}
