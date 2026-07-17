import { getFirestore } from 'firebase/firestore'
import { firebaseApp } from './firebase.js'

const db = getFirestore(firebaseApp)

export { db }
