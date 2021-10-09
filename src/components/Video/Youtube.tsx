import { React } from "../../deps.ts";

export type VideoProps = React.VideoHTMLAttributes<any> & {
  context: any;
  src: string;
};

const matchYT = /youtube\.com\/watch\?v=([^\&\?\/]+)/;

export function Youtube(props: VideoProps) {
  const id = (props.src.match(matchYT) || [])[1];

  return (
    <iframe
      className="center col-12"
      src={`https://www.youtube.com/embed/${id}`}
      width="640"
      height="427"
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
