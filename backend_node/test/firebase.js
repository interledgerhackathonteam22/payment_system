// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ2D6DJ7t69W6rn9ml7UzrdDzNfupAy1E",
    authDomain: "view-4acd3.firebaseapp.com",
    projectId: "view-4acd3",
    storageBucket: "view-4acd3.appspot.com",
    messagingSenderId: "62523321577",
    appId: "1:62523321577:web:de613877de5b9fb08a1478"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
