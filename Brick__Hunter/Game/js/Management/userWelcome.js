// js/Management/userWelcome.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwlreWuC1b3PZAfJqGQsOKCRkiIxdBSJs",
  authDomain: "brick-hunter.firebaseapp.com",
  projectId: "brick-hunter",
  storageBucket: "brick-hunter.firebasestorage.app",
  messagingSenderId: "517121888892",
  appId: "1:517121888892:web:3f512a40f655f808676ff9",
  measurementId: "G-6RDV49WMK8"
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// detect logged user
onAuthStateChanged(auth, (user) => {

    const welcomeBox = document.getElementById("welcomeUser");

    if (user) {

        welcomeBox.innerText = "Welcome " + user.email;

    } else {

        welcomeBox.innerText = "Guest User";

    }

});