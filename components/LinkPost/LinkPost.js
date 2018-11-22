import { DateTime } from "@civility/react"
import Link from "next/link"
import React from "react"
import Tags from "../Tags/Tags"


export default function LinkPost({ post }) {
  return (
    <Link as={"/" + post.id} href={"/post?postId=" + post.id} prefetch>
      <a className="text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
        <li key={post.id} className="p1 m1 mt3 link-post">
          <span className="h3 link-post-title">{post.title}</span>
          <div>
            <DateTime className="h4" timestamp={new Date(post.createdDate).getTime()} />
            <Tags tags={post.tags} />
          </div>
        </li>
      </a>
    </Link>
  )
}
