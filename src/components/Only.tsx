// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/4a50660/react/v16.13.1/react.d.ts"
import React from "https://dev.jspm.io/react@16.13.1";



export type OnlyProps = React.HTMLProps<HTMLDivElement> & {
  if: any,
}


const Only: React.FC<OnlyProps> = props => {
  const child = props.if ? props.children : ""
  return <React.Fragment>{child}</React.Fragment>
}

export default Only
