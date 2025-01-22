// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCBLB9J7TSqw12bxoMqlyie_9VN-jzKTB0",
  authDomain: "project-data-base-e2563.firebaseapp.com",
  projectId: "project-data-base-e2563",
  storageBucket: "project-data-base-e2563.firebasestorage.app",
  messagingSenderId: "1043225620787",
  appId: "1:1043225620787:web:99855812d35f98cb0f4e46",
  measurementId: "G-XTRXGNS08G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
