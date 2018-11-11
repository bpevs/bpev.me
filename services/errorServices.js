const ERROR_CODE_TO_MESSAGE = {
  "auth/email-already-in-use": "You're too late. This email is already in use.",
  "auth/invalid-email": "This isn't a real e-mail, yo.",
  "auth/weak-password": "Your password is weak-sauce. You can do better.",
  "auth/wrong-password": "You have entered an incorrect password",
}

export function readErrorMessage(errorCodeString) {
  return ERROR_CODE_TO_MESSAGE[errorCodeString] || "An error has occurred"
}
