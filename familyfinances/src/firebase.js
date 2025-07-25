// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCEbeZL6Soyx8-XG51puC7dzeO3SbiyXIo",
  authDomain: "family-finances-799cd.firebaseapp.com",
  projectId: "family-finances-799cd",
  storageBucket: "family-finances-799cd.appspot.com",
  messagingSenderId: "211077056844",
  appId: "1:211077056844:web:d8048e0d34c9be0d6fa7e9",
  measurementId: "G-24B95C2J52",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
