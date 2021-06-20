import { React } from "../../deps.ts";

export type VideoProps = React.VideoHTMLAttributes<any> & {
  context: any;
};

export function Vimeo(props: VideoProps) {
  const url = props.src && props.src.split("/") || [];
  const id = url.pop();

  return <iframe
    className="center col-12"
    src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
    width="640"
    height="427"
    frameBorder="0"
    allowFullScreen
  />;
}
