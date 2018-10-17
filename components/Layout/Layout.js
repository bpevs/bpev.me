import Head from "next/head"
import Router from "next/router"
import NProgress from "nprogress"
import React from "react"
import stylesheet from "../index.css"
import Footer from "../LayoutFooter/LayoutFooter"
import Header from "../LayoutHeader/LayoutHeader"


export default class Layout extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (!Router || !Router.router) return
    const { asPath= "", events } = Router.router

    events.on("routeChangeStart", route => {
      if (asPath.split("?")[0] !== route.split("?")[0]) {
        NProgress.start()
      }
    })
    events.on("routeChangeComplete", () => NProgress.done())
    events.on("routeChangeError", () => NProgress.done())
  }

  render() {
    const { children, className, error, header } = this.props

    return (
      <div>
        <Head>
          <title>Ben Pevsner</title>
          <meta name="author" content="Ben Pevsner" />
          <meta name="title" content="Ben Pevsner" />
          <meta name="description" content="Eating candy and doin stuff" />
          <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0" />
          <link rel="shortcut icon" href="/static/favicon.ico" />

          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <noscript>
            <style dangerouslySetInnerHTML={{ __html: ".jsonly { display: none }" }} />
          </noscript>
        </Head>

        <div className={"content sans-serif container m2 block mx-auto " + (className || "")}>
          { header === false ? "" : <Header align={header} /> }
          <section className="clearfix mx-auto">
            {error ? "OOPS SOMETHING BROKE" : children}
          </section>
        </div>

        <Footer />
      </div>
    )
  }
}
