// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEtvJ9J2TRJEu3V2pCERXXyAG7912vuEg",
  authDomain: "honest-skincare.firebaseapp.com",
  projectId: "honest-skincare",
  storageBucket: "honest-skincare.appspot.com",
  messagingSenderId: "597086215518",
  appId: "1:597086215518:web:824118dc857377f31843cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const auth = getAuth(app);