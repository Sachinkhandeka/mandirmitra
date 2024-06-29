// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mandirmitra-bd32e.firebaseapp.com",
    projectId: "mandirmitra-bd32e",
    storageBucket: "mandirmitra-bd32e.appspot.com",
    messagingSenderId: "1043845713156",
    appId: "1:1043845713156:web:a9b630be80d86d4c7ed451",
    measurementId: "G-GMQ8406ZZR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);