import { debounce } from "lodash"
import React, { Fragment, useState } from "react"
import InputText from "../InputText/InputText"


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


export const SigninForm = ({
  signinType= "signIn",
  signIn = (username, password) => { console.log(username, password) },
  signUp = (a, b, c) => { console.log(a, b, c) },
}) => {
  const [ email, setEmail ] = useState("")
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")

  const onSubmit = async (evt) => {
    evt.preventDefault()
    if (!email || !password) return
    if (signinType === "signIn") await signIn(email, password)
    if (signinType === "signUp") await signUp(email, password, username)
    history.pushState({}, "", "/")
  }

  return (
    <Fragment>
      <h2>{heading[signinType]}</h2>
      <form onSubmit={onSubmit}>
        <InputText
          onChange={({ target }) => setEmail(target.value)}
          name="email" type="email" label="Email"
          placeholder="Enter email"
          value={email} />

        <InputText
          onChange={({ target }) => setUsername(target.value)}
          name="username" type="username" label="Username"
          placeholder={usernamePlaceholder[signinType]}
          disabled={!usernamePlaceholder[signinType]}
          value={username} />

        <InputText
          onChange={({ target }) => setPassword(target.value)}
          name="password" type="password" label="Password"
          placeholder={passwordPlaceholder[signinType]}
          disabled={!passwordPlaceholder[signinType]}
          value={password} />

        <button
          children="Submit"
          disabled={!passwordPlaceholder[signinType]}
        />
      </form>
    </Fragment>
  )
}
