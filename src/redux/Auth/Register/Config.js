import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDS6cOg_IotxSBLzfFHOtOeYLsXiVr58L8",
  authDomain: "contractor-ccd80.firebaseapp.com",
  projectId: "contractor-ccd80",
  storageBucket: "contractor-ccd80.firebasestorage.app",
  messagingSenderId: "1015371746180",
  appId: "1:1015371746180:web:fa74a031a88f3c1c636bd1",
  measurementId: "G-FHWWDQRER6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };