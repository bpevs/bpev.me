import React, { useState } from "react"
import { readErrorMessage } from "../../services/errorServices"
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
  signIn= (username, password) => { console.log(username, password) },
  signUp= (a, b, c) => { console.log(a, b, c) },
}) => {
  const [ email, setEmail ] = useState("")
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ type, setSigninType ] = useState(signinType)

  const onSubmit = async (evt) => {
    evt.preventDefault()
    if (!email || !password) return
    if (type !== "signIn" && type !== "signUp") return

    try {
      if (type === "signIn") await signIn(email, password)
      if (type === "signUp") await signUp(email, password, username)

      location.assign("/")
    } catch (error) {
      alert(readErrorMessage(error.code))
    }
  }

  return (
    <form onSubmit={onSubmit} className="sm-col-6 mx-auto">
      <h2>{heading[type]}</h2>
      <InputText
        className="block col-12 field h4"
        onChange={({ target }) => setEmail(target.value)}
        name="email" type="email" label="Email"
        placeholder="Enter email"
        value={email} />

      {
        type === "signUp"
          ? <InputText
            className="block col-12 field h4"
            onChange={({ target }) => setUsername(target.value)}
            name="username" type="username" label="Username"
            placeholder={usernamePlaceholder[type]}
            disabled={!usernamePlaceholder[type]}
            value={username} />
          : ""
      }

      <InputText
        className="block col-12 field h4"
        onChange={({ target }) => setPassword(target.value)}
        name="password" type="password" label="Password"
        placeholder={passwordPlaceholder[signinType]}
        disabled={!passwordPlaceholder[signinType]}
        value={password} />

      <button
        children={heading[type]}
        className="btn btn-primary bold h4 inline-block mt2"
        disabled={!passwordPlaceholder[signinType]}
      />

      <button
        children={type === "signIn" ? "Sign Up" : "Sign In"}
        className="btn link h4 inline-block mt2 ml2"
        onClick={evt => {
          evt.preventDefault()
          setSigninType(type === "signIn" ? "signUp" : "signIn")
        }} />
    </form>
  )
}
