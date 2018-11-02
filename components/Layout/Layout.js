import { classNames as combine } from "@civility/utilities"
import React from "react"
import Footer from "../LayoutFooter/LayoutFooter"
import Header from "../LayoutHeader/LayoutHeader"
const pageStyles = "content sans-serif container m2 block mx-auto"


export default ({
  children,
  className= "",
  headerAlign= "",
}) => {
  return (
    <div>
      <div className={combine(pageStyles, className)}>
        <Header align={headerAlign} />
        <section className="clearfix mx-auto">
          {children}
        </section>
      </div>
      <Footer />
    </div>
  )
}
