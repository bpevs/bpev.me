import Document, { Head, Main, NextScript } from "next/document"
import React from "react"
import stylesheet from "../components/index.css"


export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="author" content="Ben Pevsner" />
          <meta name="title" content="Ben Pevsner" />
          <meta name="description" content="Eating candy and doin stuff" />
          <meta
            name="viewport"
            content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0" />
          <link rel="shortcut icon" href="/static/favicon.ico" />

          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
          <noscript><style>{".jsonly { display: none }"}</style></noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
