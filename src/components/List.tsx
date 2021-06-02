import { React } from '../deps.ts'

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
