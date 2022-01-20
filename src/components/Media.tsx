import React from "react";

import { Image } from "./Image.tsx";
import { isVideo, Video } from "./Video/Video.tsx";

const IMAGE = "image";
const LINK = "link";
const VIDEO = "video";

export default function Media(props: any) {
  switch (getType(props)) {
    case VIDEO:
      return <Video {...props} />;
    case IMAGE:
      return <Image {...props} />;
    case LINK:
    default:
      return <a {...props} />;
  }
}

function getType(props: any) {
  const url = props.src || props.href;
  if (isVideo(url)) return VIDEO;
  return props.src ? IMAGE : LINK;
}
