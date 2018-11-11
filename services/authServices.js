import { auth } from "./firebase"


/**
 * Update auth state for a user. If email/password is given,
 * try to signin. If not, signout.
 * @param {string} email
 * @param {string} password
 */
export async function updateAuthState(email= "", password= "") {
  if (!email && !password) return auth().signOut()
  return auth().signInWithEmailAndPassword(email, password)
}

export function onAuthStateChanged(func) {
  auth().onAuthStateChanged(func)
}
