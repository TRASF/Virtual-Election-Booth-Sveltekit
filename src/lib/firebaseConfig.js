import firebase from 'firebase/compat/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

import 'dotenv';
const firebaseConfig = {
  apiKey:  import.meta.env.VITE_APIKEY,
  authDomain:  import.meta.env.VITE_AUTHDOMAIN,
  projectId:  import.meta.env.VITE_PROJECTID,
  storageBucket:  import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId:  import.meta.env.VITE_MESSAGINGSENDERID,
  appId:  import.meta.env.VITE_APPID,
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export {auth, firestore};