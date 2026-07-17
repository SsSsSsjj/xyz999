import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDn2Kk8y5G_u-wpJNlkrBx3gqBj6GP8AXA',
  authDomain: 'xyz999-43513.firebaseapp.com',
  projectId: 'xyz999-43513',
  storageBucket: 'xyz999-43513.firebasestorage.app',
  messagingSenderId: '286410281224',
  appId: '1:286410281224:web:4d00a8bf39cc3e30f75cbd',
  measurementId: 'G-VRT2KKPQYD',
}

const firebaseApp = initializeApp(firebaseConfig)

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(firebaseApp)
  })
  .catch(() => {
    // Analytics is optional and can be unavailable in restricted browsers.
  })

export { firebaseApp }
