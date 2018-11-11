import React, { Fragment } from "react"


export default ({ label, ...props }) => {
  if (!label) return <input {...props} />

  return (
    <Fragment>
      <label className="block pt2">{label}</label>
      <input {...props} />
    </Fragment>
  )
}
