// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ2D6DJ7t69W6rn9ml7UzrdDzNfupAy1E",
    authDomain: "view-4acd3.firebaseapp.com",
    projectId: "view-4acd3",
    storageBucket: "view-4acd3.appspot.com",
    messagingSenderId: "62523321577",
    appId: "1:62523321577:web:de613877de5b9fb08a1478"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

