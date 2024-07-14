// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"; 
import {getFirestore} from "firebase/firestore"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbX2qHC6WNxVVZqb0b09Uhz92Plu34tss",
  authDomain: "ftc-bf743.firebaseapp.com",
  projectId: "ftc-bf743",
  storageBucket: "ftc-bf743.appspot.com",
  messagingSenderId: "345265811605",
  appId: "1:345265811605:web:181986d4348f2ffcebab9c",
  measurementId: "G-D7GJSHEN58"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP); // not currently used but saving for later

// Just some option I enabled when creating the Firebase project 
// const analytics = getAnalytics(FIREBASE_APP);