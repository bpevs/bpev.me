import React from "react";

import { Image } from "./Image.tsx";
import { Audio, isAudio } from "./Audio/Audio.tsx";
import { isVideo, Video } from "./Video/Video.tsx";

const IMAGE = "image";
const LINK = "link";
const VIDEO = "video";
const AUDIO = "audio";

export default function Media(props: any) {
  switch (getType(props)) {
    case VIDEO:
      return <Video {...props} />;
    case IMAGE:
      return <Image {...props} />;
    case AUDIO:
      return <Audio {...props} />;
    case LINK:
    default:
      return <a {...props} />;
  }
}

function getType(props: any) {
  const url = props.src || props.href;
  if (isVideo(url)) return VIDEO;
  if (isAudio(url)) return AUDIO;
  return props.src ? IMAGE : LINK;
}
