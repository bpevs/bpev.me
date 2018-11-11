const ERROR_CODE_TO_MESSAGE = {
  "auth/email-already-in-use": "You're too late. This email is already in use.",
  "auth/invalid-email": "This isn't a real e-mail, yo.",
  "auth/user-disabled": "This user is disabled!",
  "auth/user-not-found": "This user doesn't exist! Try signing up instead!",
  "auth/weak-password": "Your password is weak-sauce. You can do better.",
  "auth/wrong-password": "You have entered an incorrect password",
}

export function readErrorMessage(error) {
  const code = error.code || error
  return ERROR_CODE_TO_MESSAGE[code] || error || "An error has occurred"
}
