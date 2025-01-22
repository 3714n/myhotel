/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
/* eslint-disable */
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALvxWDSYo5cX0absTCsoWQeFTKbMLvNLA",
  authDomain: "pueblo-bello-4ee81.firebaseapp.com",
  projectId: "pueblo-bello-4ee81",
  storageBucket: "pueblo-bello-4ee81.firebasestorage.app",
  messagingSenderId: "118361733920",
  appId: "1:118361733920:web:05dfd06c4d4cc78840f545",
  measurementId: "G-FZRWQRDGBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
