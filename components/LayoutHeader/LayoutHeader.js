import Link from "next/link"
import React from "react"

export default ({ align= "" }) => (
    <nav className={"fit " + align}>
      <a href={"/"} className="h1 m1 black text-decoration-none header-title">
        Ben Pevsner
      </a>
    </nav>
)
