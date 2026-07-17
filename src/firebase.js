import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'xyz999-43513.firebaseapp.com',
  projectId: 'xyz999-43513',
  storageBucket: 'xyz999-43513.firebasestorage.app',
  messagingSenderId: '286410281224',
  appId: '1:286410281224:web:4d00a8bf39cc3e30f75cbd',
  measurementId: 'G-VRT2KKPQYD',
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({ prompt: 'select_account' })

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(firebaseApp)
  })
  .catch(() => {
    // Analytics is optional and can be unavailable in restricted browsers.
  })

export { auth, firebaseApp, googleProvider }
