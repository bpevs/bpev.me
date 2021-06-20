import { React } from "../deps.ts";

import Only from "./Only.tsx";
import classNames from "../utilities/classNames.ts";
import decodeHTMLEntities from "../utilities/decodeHTMLEntities.ts";

export type ImageProps = React.ImgHTMLAttributes<any> & {
  context: any;
  showText?: boolean;
};

export function Image({ context, showText = false, ...props }: ImageProps) {
  let alt = props.alt;
  if (!alt && props.src) {
    const lastSlashIndex = props.src.lastIndexOf('/');
    const imageName = props.src.substring(lastSlashIndex + 1);
    alt = `link to image ${imageName}`
  }

  return <React.Fragment>
    <a href={props.src} target="_blank" rel="noreferrer">
      <img
        {...props}
        className={classNames("col-12", "image", props.className)}
        src={`${props.src}?height=750&fit=outside`}
        sizes="
        (min-width: 800px) 750px,
        (max-width: 800px) 500px
        "
        srcSet={`
          ${props.src}?height=750&fit=outside 750w,
          ${props.src}?height=500&fit=outside 500w
        `}
        alt={alt}
        loading="lazy"
      />
      <Only if={props.alt && showText}>
        <span className="block center col-12 h6">
          {decodeHTMLEntities(props.alt || "")}
        </span>
      </Only>
    </a>
  </React.Fragment>;
}
