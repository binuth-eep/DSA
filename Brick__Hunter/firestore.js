import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwlreWuC1b3PZAfJqGQsOKCRkiIxdBSJs",
  authDomain: "brick-hunter.firebaseapp.com",
  projectId: "brick-hunter",
  storageBucket: "brick-hunter.firebasestorage.app",
  messagingSenderId: "517121888892",
  appId: "1:517121888892:web:3f512a40f655f808676ff9",
  measurementId: "G-6RDV49WMK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
