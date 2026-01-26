import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDJeEWRG7AZH9kIdbtDRwxJ-FexfX6b3p4",
  authDomain: "modlift-chat.firebaseapp.com",
  projectId: "modlift-chat",
  storageBucket: "modlift-chat.firebasestorage.app",
  messagingSenderId: "1032394412533",
  appId: "1:1032394412533:web:6756a4582888291ef590bc",
  measurementId: "G-J7SXGJLN4W"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
