import React from "react"
import Layout from "../components/Layout/Layout"
import { SigninForm } from "../components/SigninForm/SigninForm"
import { updateAuthState } from "../services/authServices"
import { createUser } from "../services/userServices"


export default class extends React.Component {

  state = {
    signinType: "signIn",
  }

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
        <SigninForm
          signIn={updateAuthState}
          signUp={createUser}
          signinType={this.state.signinType}
        />
        {
          this.state.signinType === "signIn"
            ? <button
              children="Sign Up"
              onClick={() => this.setState({ signinType: "signUp"})} />
            : <button
              children="Sign In"
              onClick={() => this.setState({ signinType: "signIn"})} />
        }
      </Layout>
    )
  }
}
