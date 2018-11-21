import { classNames as combine, isString } from "@civility/utilities"
import React, { Fragment } from "react"


export function Input({ ...props }) {
  if (!props.label) return <input {...props} />

  const labelComponent = isString(props.label)
    ? <label className="bold block pt2">{props.label}</label>
    : props.label

  return (
    <Fragment>
      {labelComponent}
      <input {...props} className={combine("input", props.className)} />
    </Fragment>
  )
}
