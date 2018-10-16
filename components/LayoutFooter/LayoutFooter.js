import Link from "next/link"
import React from "react"


export default function LayoutFooter() {
  return (
    <footer className="footer sans-serif col-12 pt4 pb4 mt4">
      <div className="row white p2">
        Made by Ben Pevsner
      </div>
      <div className="row p2">
        <Link href="https://github.com/ivebencrazy">
          <a className="white p2 o5 text-decoration-none">github</a>
        </Link>
        <Link href="https://ivebencrazy.bandcamp.com/">
          <a className="white p2 o5 text-decoration-none">bandcamp</a>
        </Link>
        <Link href="https://www.youtube.com/channel/UCpznF0d3ky603SFPzJwtT0g">
          <a className="white p2 o5 text-decoration-none">youtube</a>
        </Link>
      </div>
    </footer>
  )
}
