import Link from "next/link"
import React from "react"
import Layout from "../Layout/Layout"
import RelatedPosts from "../RelatedPosts/RelatedPosts"


export default ({ post, relatedPosts }) => {
  return (
    <Layout>
      <div className="center p2">
        <div className="flex flex-wrap mxn2">
          {post.content.map((name, key) => {
            return <PhotoLink {...{ post, name, key }} />
          })}
        </div>
        <RelatedPosts post={post} relatedPosts={relatedPosts} />
      </div>
    </Layout>
  )
}


function PhotoLink({ post, name }) {
  const as = `/${post.id}/${name}`
  const href = `/media?postId=${post.id}&mediaId=${name}`

  return (
    <Link as={as} href={href}>
      <a className="flex fit-50 overflow-hidden height-500">
        <span className="image-wrapper">
          <img
            width="600"
            height="600"
            className="cover image pointer"
            src={post.root + "/medium/" + name} />

          <span className="spinkit-wrapper">
            <div className="spinkit" />
          </span>
        </span>
      </a>
    </Link>
  )
}
