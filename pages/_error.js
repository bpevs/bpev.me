import Error from "next/error"
import React from "react"


const ErrorPage = ({ statusCode }) => {
  return <Error statusCode={statusCode} />
}


ErrorPage.getInitialProps = async ({ res, err }) => {
  if (res) return { statusCode: res.statusCode }
  if (err) return { statusCode: err.statusCode }
  return null
}

export default ErrorPage
