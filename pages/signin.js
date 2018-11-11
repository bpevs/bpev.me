import React from "react"
import Layout from "../components/Layout/Layout"
import { SigninForm } from "../components/SigninForm/SigninForm"


export default class extends React.Component {
  constructor(props, state) {
    super(props, state)
  }

  static async getInitialProps(context) {
    const query = context && context.query || {}
    return { ...query }
  }

  render() {
    return (
      <Layout>
        <SigninForm />
      </Layout>
    )
  }
}
