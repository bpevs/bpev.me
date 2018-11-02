import Link from "next/link"
import React from "react"
import LongDate from "../LongDate/LongDate"
import Tags from "../Tags/Tags"


const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function LinkPost({ post }) {
  let date = ""
  if (post.createdDate) {
    const [ y, m, d ] = post.createdDate.split("-")
    date = `${months[Number(m) - 1]} ${d}, ${y}`
  }

  return (
    <Link as={"/" + post.id} href={"/post?postId=" + post.id} prefetch>
      <a className="text-decoration-none" onClick={() => window.scrollTo(0, 0)}>
        <li key={post.id} className="p1 m1 mt3 link-post">
          <span className="h3 link-post-title">{post.title}</span>
          <div>
            <LongDate date={post.createdDate} />
            <Tags tags={post.tags} />
          </div>
        </li>
      </a>
    </Link>
  )
}
