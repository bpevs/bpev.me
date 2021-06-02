// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";

export type VideoProps = React.VideoHTMLAttributes<any> & {
  context: any,
  src: string,
}

const matchYT = /youtube\.com\/watch\?v=([^\&\?\/]+)/

export function Youtube(props: VideoProps) {
  const id = (props.src.match(matchYT) || [])[1]

  return <iframe
    className="center col-12"
    src={`https://www.youtube.com/embed/${id}`}
    width="640"
    height="427"
    frameBorder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  />
}
