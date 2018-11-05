import React from "react"


export default ({ label, ...props }) => {
  if (!label) return <input {...props} />

  return (
    <label>
      {label}
      <input {...props} />
    </label>
  )
}
