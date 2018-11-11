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

export function onAuthStateChanged(callback) {
  auth().onAuthStateChanged(user => {
    if (!user) return callback(null)

    callback({
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      metadata: user.metadata,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerData: user.providerData,
      refreshToken: user.refreshToken,
      uid: user.uid,
    })
  })
}
