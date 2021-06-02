// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";

import { Image } from "./Image.tsx"
import { isVideo, Video } from "./Video/Video.tsx"


const IMAGE = "image"
const LINK = "link"
const VIDEO = "video"


export default function Media(props: any) {
  switch (getType(props)) {
    case VIDEO: return <Video {...props} />
    case IMAGE: return <Image {...props} />
    case LINK:
    default:
      return <a {...props} />
  }
}

function getType(props: any) {
  const url = props.src || props.href
  if (isVideo(url)) return VIDEO
  return props.src ? IMAGE : LINK
}
