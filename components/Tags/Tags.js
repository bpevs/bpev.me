import React from "react"
import Tag from "../Tag/Tag"


export default function Tags({ tags }) {
  return (
    <span>
      {tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
    </span>
  )
}
