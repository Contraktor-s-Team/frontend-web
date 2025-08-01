import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSTksGGbIRqWGBf3SncEqbpV9fgZIdSJY",
  authDomain: "charged-genre-464907-b2.firebaseapp.com",
  projectId: "charged-genre-464907-b2",
  storageBucket: "charged-genre-464907-b2.firebasestorage.app",
  messagingSenderId: "672566475672",
  appId: "1:672566475672:web:4192280e0d9a2a25b509ed",
  measurementId: "G-BZC8QFN1H2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };