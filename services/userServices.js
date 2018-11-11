import { auth, database } from "./firebase"

/**
 * @definition USER
 * @property {string} displayName - user's displayed name
 * @property {string} email
 * @property {boolen} emailVerified - Is a user's email verified?
 * @property {string} name - user's kebabCase name. (mostly for url)
 * @property {string} uid - user's id (for code reference, not displayed)
 * @property {string} photoURL - user's avatar
 * @property {string} providerData
 * @property {string} refreshToken
 */

/**
 * Create a new user from email/password
 * @param {string} email User's email
 * @param {string} password User's desired password
 * @param {string} username User's username
 */
export async function createUser(email, password, username) {
  if (!email) throw Error("auth/no-email")
  if (!password) throw Error("auth/no-password")
  if (!username) throw Error("auth/no-username")
  await auth().createUserWithEmailAndPassword(email, password)

  const user = auth().currentUser
  if (!user) throw Error("auth/not-logged-in")

  await updateCurrentUser({
    displayName: username,
    photoURL: null,
  })

  auth().useDeviceLanguage()
  await user.sendEmailVerification()
}

/**
 * Delete the currently logged-in user
 */
export async function deleteUser() {
  const currentUser = auth().currentUser
  if (!currentUser) return

  await database()
    .ref(`/users/${currentUser.uid}`)
    .remove()

  currentUser.delete()
}

/**
 * Get user's data via UID
 * @param {string} uid User ID
 */
export async function readUser(uid) {
  const userSnapshot = await database()
    .ref(`users/${uid}`)
    .once("value")

  return userSnapshot.val()
}

/**
 * Update a user's data via object with desired property changes
 * @param {object} updates
 * @property {string|null} displayName User's name
 * @property {string|null} photoURL User's avatar
 */
export async function updateCurrentUser({
  displayName = null,
  photoURL = null,
}) {
  const user = auth().currentUser
  if (!user) throw Error("user/no-user-authenticated")

  return await user.updateProfile({
    displayName,
    photoURL,
  })
}
