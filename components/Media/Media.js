import Image from "../MediaImage/Image";
import Video from "../MediaVideo/Video";


const IMAGE = "image";
const VIDEO = "video";


export default function (props) {
  switch(getType(props.src)) {
    case VIDEO:
      return <Video {...props} />;

    case IMAGE:
    default:
      return <Image {...props} />;
  }
}


function getType(url) {
  if (url.indexOf("vimeo") > -1) return VIDEO;

  return IMAGE;
}
