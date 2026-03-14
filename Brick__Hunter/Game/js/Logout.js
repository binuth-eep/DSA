// Logout.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

// Firebase config (same as your main auth page)
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
const auth = getAuth(app);

// Get DOM elements (make sure these exist in your page)
const logoutBtn = document.getElementById("logoutBtn");
const authBox = document.getElementById("authBox"); // optional
const userStatus = document.getElementById("userStatus"); // optional

// Logout function
function logout() {
  signOut(auth)
    .then(() => {
      document.cookie = "userToken=; max-age=0; path=/; Secure; SameSite=Lax";

      if(authBox) authBox.style.display = "block";
      if(userStatus) userStatus.innerText = "Logged out";

      window.location.href = "../../auth.html";
    })
    .catch((error) => alert("Logout failed: " + error.message));
}

// Attach logout function to button
if(logoutBtn) logoutBtn.onclick = logout;
