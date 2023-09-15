import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB9ideRTSrgOK1a6jfWCWx37u5aNqbD664",
  authDomain: "movix-website.firebaseapp.com",
  projectId: "movix-website",
  storageBucket: "movix-website.appspot.com",
  messagingSenderId: "83250660370",
  appId: "1:83250660370:web:ce4ede69a987b0a9ea44cb"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword};
export default db;