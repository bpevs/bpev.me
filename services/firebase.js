import { FIREBASE } from "../constants"

import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE)
}

const auth = firebase.auth
const database = firebase.database
const storage = firebase.storage

export { auth, database, storage }
