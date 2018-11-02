import Link from "next/link"
import React from "react"

export default ({ align= "" }) => (
    <nav className={"fit " + align}>
        <Link as={"/"} href={"/"} prefetch>
          <a className="h1 m1 black text-decoration-none header-title">
            Ben Pevsner
          </a>
        </Link>
    </nav>
)
