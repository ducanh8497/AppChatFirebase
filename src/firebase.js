// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzn18gZQmn5nTCWF8PoZSnZYDRtzwL2cg",
  authDomain: "appchatwithfirebase-1d70d.firebaseapp.com",
  databaseURL: "https://appchatwithfirebase-1d70d-default-rtdb.firebaseio.com",
  projectId: "appchatwithfirebase-1d70d",
  storageBucket: "appchatwithfirebase-1d70d.appspot.com",
  messagingSenderId: "178451025081",
  appId: "1:178451025081:web:dafd638f7653ed8c30df68",
  measurementId: "G-4YE5Y1ETJ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
