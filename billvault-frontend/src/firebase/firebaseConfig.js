// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUWlh1wRo4WOX1d3bomzizSrCBvQ1jc-Y",
  authDomain: "billvault-51dc6.firebaseapp.com",
  projectId: "billvault-51dc6",
  storageBucket: "billvault-51dc6.firebasestorage.app",
  messagingSenderId: "493957843850",
  appId: "1:493957843850:web:0ce4a1de6c4a38162b1673",
  measurementId: "G-34J670CXLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);