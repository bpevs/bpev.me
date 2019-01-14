import { get } from "@civility/utilities"
import React from "react"


export default function Image({ context, ...props }) {
  const post = get(context, [ "post" ])
  if (!post || (context.type !== "blog")) {
    return <img {...props} />
  }

  const src = (post.contentRoot + "/" + props.src)

  return <img
    {...props}
    className={ "col-12 " + (props.className || "") }
    src={src}
  />
}
