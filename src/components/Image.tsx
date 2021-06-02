// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";

import Only from "./Only.tsx";
import classNames from '../utilities/classNames.ts';
import decodeHTMLEntities from '../utilities/decodeHTMLEntities.ts';


export type ImageProps = React.ImgHTMLAttributes<any> & {
  context: any,
  showText?: boolean,
}

export function Image({ context, showText = false, ...props }: ImageProps) {
  return <React.Fragment>
    <a href={props.src} target="_blank">
      <img
        {...props}
        className={classNames("col-12", "image", props.className)}
        src={props.src}
      />
      <Only if={props.alt && showText}>
        <span className="block center col-12 h6">
          {decodeHTMLEntities(props.alt || "")}
        </span>
      </Only>
    </a>
  </React.Fragment>
}
