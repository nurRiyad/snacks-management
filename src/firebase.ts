import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'

// Prod config
const firebaseConfig = {
  apiKey: 'AIzaSyAR84yRMSxqodyPoQbyYso0iNo6T--qZ7g',
  authDomain: 'personal-project-4ac6f.firebaseapp.com',
  projectId: 'personal-project-4ac6f',
  storageBucket: 'personal-project-4ac6f.appspot.com',
  messagingSenderId: '337096134393',
  appId: '1:337096134393:web:0a45f01c4a88578d839c28',
}

// Dev Config
// const firebaseConfig = {
//   apiKey: 'AIzaSyAnSbkQ4wAXYblFCRuR8fkku-GnbwEBW94',
//   authDomain: 'snacks-management-e1e18.firebaseapp.com',
//   projectId: 'snacks-management-e1e18',
//   storageBucket: 'snacks-management-e1e18.appspot.com',
//   messagingSenderId: '189923492402',
//   appId: '1:189923492402:web:04e225b1d04664e33db22b',
// }

export const firebaseApp = initializeApp(firebaseConfig)

// used for the firestore refs
const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const todosRef = collection(db, 'todos')
