
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBiL22TMT2F1x__DFIPgibVlHAc9xrJ8EQ",
  authDomain: "voting-app-9cc9e.firebaseapp.com",
  projectId: "voting-app-9cc9e",
  storageBucket: "voting-app-9cc9e.appspot.com",
  messagingSenderId: "367800385600",
  appId: "1:367800385600:web:ecafef3630e5b8e44e9fa5",
  measurementId: "G-4PLCMS8T57"
};

const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app);
const firestoreInstance = getFirestore(app);
const storageInstance = getStorage(app);
const provider = new GoogleAuthProvider();

export { authInstance as auth, firestoreInstance as firestore, provider, storageInstance as storage };

