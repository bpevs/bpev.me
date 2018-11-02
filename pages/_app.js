import App, { Container } from "next/app"
import Head from "next/head"
import Router from "next/router"
import NProgress from "nprogress"
import React from "react"
const router = Router.router


export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  static componentDidMount() {
    if (!router) return
    const { asPath= "", events } = router

    events.on("routeChangeStart", route => {
      const currPath = asPath.split("?")[0]
      const nextPath = route.split("?")[0]
      if (currPath !== nextPath) NProgress.start()
    })
    events.on("routeChangeComplete", () => NProgress.done())
    events.on("routeChangeError", () => NProgress.done())
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>Ben Pevsner</title>
        </Head>
        <Component {...pageProps} />
      </Container>
    )
  }
}
