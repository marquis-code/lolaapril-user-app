import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
     apiKey: "AIzaSyB3blZmoQfuy1rZRwkIdm10Mns3k51rVr0",
      authDomain: "lolaapril-ddec1.firebaseapp.com",
      projectId: "lolaapril-ddec1",
      storageBucket: "lolaapril-ddec1.firebasestorage.app",
      messagingSenderId: "45278791445",
      appId: "1:45278791445:web:e0e505de61c03ef91d4b1c",
      measurementId: "G-2CJ1W7N7PY"
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  return {
    provide: {
      firebaseAuth: auth,
    },
  }
})
