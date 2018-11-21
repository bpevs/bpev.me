import { classNames as c } from "@civility/utilities"
import React from "react"


export function Button({
  className,
  ...props
}) {
  return <button
    {...props}
    className={c("button", className)}
  />
}
