import { DateTime } from "@civility/react"
import Link from "next/link"
import React from "react"


export default function LinkPost({ post }) {
  return (
    <li className="p0 m0 link-post">
      <Link as={"/" + post.id} href={"/post?postId=" + post.id} prefetch>
        <a className="text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
          <div key={post.id} className="p0 m0">
            <span className="h3 link-post-title align-middle">{post.title} - </span>
            <DateTime
              className="h4 align-middle o7"
              timestamp={new Date(post.createdDate).getTime()}
              options={{ weekday: undefined, year: undefined }}
            />
          </div>
        </a>
      </Link>
    </li>
  )
}
