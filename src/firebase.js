// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADpEoI7Kk-PGtNEUbYpv09kxHqoyS-ht8",
  authDomain: "smart-lot-8df80.firebaseapp.com",
  projectId: "smart-lot-8df80",
  storageBucket: "smart-lot-8df80.firebasestorage.app",
  messagingSenderId: "535163867948",
  appId: "1:535163867948:web:f0cb1c144fb292d2449289",
  measurementId: "G-CRMJT5XSJR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
