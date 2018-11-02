import { intersection } from "lodash"
import React from "react"
import LinkPost from "../LinkPost/LinkPost"


export default function RelatedPosts({ post= {}, relatedPosts= [] }) {
  const relatedPostComponents = relatedPosts
    .filter(isRelatedPost.bind(post))
    .map(post => <LinkPost key={post.id} post={post} />)
    .slice(0, 3)

  if (!relatedPostComponents.length) return <span></span>

  return (
    <ul className="list-reset">
      <h1>Similar Posts...</h1>
      {relatedPostComponents}
    </ul>
  )
}

function isRelatedPost(relatedPost) {
  if (!this || !relatedPost) return false
  if (relatedPost.draft) return false
  if (this.id !== relatedPost.id) return false
  return intersection(this.tags, relatedPost.tags).length > 0
}
