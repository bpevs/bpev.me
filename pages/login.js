import { debounce } from "lodash"
import React, { useEffect, useState } from "react"
import InputText from "../components/InputText/InputText"
import Layout from "../components/Layout/Layout"

const heading = {
  loading: "Loading...",
  none: "There's no Comments! Join the discussion!",
  signIn: "Sign In",
  signUp: "Sign Up",
}

const passwordPlaceholder = {
  signIn: "Enter Password",
  signUp: "Choose Password",
}

const usernamePlaceholder = {
  signUp: "Choose username",
}


export default ({
  signinType= "signIn",
  signIn= (username, password) => { console.log(username, password) },
  signUp= (a, b, c) => { console.log(a, b, c) },
  updateSigninType= (email) => { console.log(email) },
}) => {
  const [ email, setEmail ] = useState("")
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  const debouncedUpdateSigninType = debounce(updateSigninType, 500)

  useEffect(() => {
    const isValidEmail = email && (/\S+@\S+\.\S+/).test(email)
    if (isValidEmail) debouncedUpdateSigninType(email)
  })

  const onSubmit = async () => {
    if (!email || !password) return
    if (signinType === "signIn") await signIn(email, password)
    if (signinType === "signUp") await signUp(email, password, username)
    history.pushState({}, "", "/")
  }

  return (
    <Layout>
      <h2>{heading[signinType]}</h2>
      <form onSubmit={onSubmit}>
        <InputText
          onChange={({ target }) => setEmail(target.value)}
          name="email" type="email" label="Email"
          placeholder="Enter email"
          value={this.state.email} />
        <InputText
          onChange={({ target }) => setUsername(target.value)}
          name="username" type="username" label="Username"
          placeholder={usernamePlaceholder[signinType]}
          disabled={!usernamePlaceholder[signinType]}
          value={this.state.username} />
        <InputText
          onChange={({ target }) => setPassword(target.value)}
          name="password" type="password" label="Password"
          placeholder={passwordPlaceholder[signinType]}
          disabled={!passwordPlaceholder[signinType]}
          value={this.state.password} />
        <button
          children="Submit"
          disabled={!passwordPlaceholder[signinType]}
        />
      </form>
    </Layout>
  )
}
