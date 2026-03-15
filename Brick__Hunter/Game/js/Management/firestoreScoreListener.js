// js/Management/firestoreScoreListener.js

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const auth = getAuth();
const db = getFirestore();

function getCurrentScore() {

    const scoreElement = document.getElementById("ui-score");

    if (!scoreElement) return 0;

    return Number(scoreElement.innerText) || 0;

}

function getCurrentLevel() {

    const levelElement = document.getElementById("ui-lvl");

    if (!levelElement) return 1;

    return Number(levelElement.innerText) || 1;

}

async function saveScoreToFirestore() {

    const user = auth.currentUser;

    if (!user) {
        console.warn("User not logged in");
        return;
    }

    const score = getCurrentScore();
    const level = getCurrentLevel();

    try {

        await addDoc(collection(db, "gameScores"), {

            uid: user.uid,
            email: user.email,
            score: score,
            level: level,
            createdAt: serverTimestamp()

        });

        console.log("Score saved:", score);

    } catch (err) {

        console.error("Firestore save error:", err);

    }

}


// Detect when Game Over screen appears
function observeGameOver() {

    const gameOverScreen = document.getElementById("screen-gameover");

    if (!gameOverScreen) return;

    const observer = new MutationObserver(() => {

        if (!gameOverScreen.classList.contains("hidden")) {

            saveScoreToFirestore();

        }

    });

    observer.observe(gameOverScreen, {
        attributes: true,
        attributeFilter: ["class"]
    });

}

window.addEventListener("DOMContentLoaded", observeGameOver);