// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";

import classNames from '../utilities/classNames.ts';
import Media from "./Media.tsx";


export type ListProps = React.HTMLAttributes<any>;

function List({ children, ...props }: ListProps) {
  let images = 0
  let lis = 0
  React.Children.forEach(children, (child: any) => {
    if (child && child.type === "li") {
      lis++;
      if (child?.props?.children?.[1]?.type === Media) images++;
    }
  })

  const isImageList = lis === images
  const className = classNames(props.className, isImageList && "image-list")

  return (
    <ul {...props} className={className}>
      {children}
    </ul>
  )
}

export default List;
