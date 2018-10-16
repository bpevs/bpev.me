import React from "react"

export default function MediaVideo(props) {
  const url = props.src.split("/")
  const id = url.pop()

  return <iframe
    className="center col-12"
    src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
    width="640"
    height="427"
    frameBorder="0"
    allowFullScreen />
}
