import { React } from "../deps.ts";

import Only from "./Only.tsx";
import classNames from "../utilities/classNames.ts";
import decodeHTMLEntities from "../utilities/decodeHTMLEntities.ts";

export type ImageProps = React.ImgHTMLAttributes<any> & {
  context: any;
  showText?: boolean;
};

export function Image({ context, showText = false, ...props }: ImageProps) {
  return <React.Fragment>
    <a href={props.src} target="_blank">
      <img
        {...props}
        className={classNames("col-12", "image", props.className)}
        src={`${props.src}?width=750&height=750&fit=outside`}
      />
      <Only if={props.alt && showText}>
        <span className="block center col-12 h6">
          {decodeHTMLEntities(props.alt || "")}
        </span>
      </Only>
    </a>
  </React.Fragment>;
}
