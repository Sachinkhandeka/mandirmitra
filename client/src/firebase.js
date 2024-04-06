// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "prayasitrack.firebaseapp.com",
  projectId: "prayasitrack",
  storageBucket: "prayasitrack.appspot.com",
  messagingSenderId: "919381319970",
  appId: "1:919381319970:web:8e8f0668d2fe641bb0857b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);