// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD81ssExnkAC99E83PZxyHGHxXzqkbx96s",
  authDomain: "moviehush-c8e5c.firebaseapp.com",
  projectId: "moviehush-c8e5c",
  storageBucket: "moviehush-c8e5c.firebasestorage.app",
  messagingSenderId: "696886698863",
  appId: "1:696886698863:web:396ff20982003f919d7e9a",
  measurementId: "G-LFJNS6RE5S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
