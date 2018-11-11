import { readErrorMessage } from "./errorServices"
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
 * Create a new user from email/password
 * @param {string} email User's email
 * @param {string} password User's desired password
 */
export async function createUser(email, password) {
  try {
    await auth().createUserWithEmailAndPassword(email, password)
  } catch (error) {
    alert(readErrorMessage(error.code))
    throw error
  }
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
 * @param {string} uid User ID
 * @param {object} userUpdates
 */
export function updateUser(uid, userUpdates) {
  return database()
    .ref()
    .update({
      [`/users/${uid}`]: userUpdates,
    })
}
