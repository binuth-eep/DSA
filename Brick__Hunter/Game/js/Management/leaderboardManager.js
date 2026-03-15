import { db } from "./firebase.js";
import {
    collection,
    doc,
    setDoc,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

export default class LeaderboardManager {

    constructor(auth) {
        this.auth = auth;
        this.collection = collection(db, "leaderboard");
    }

    async addScore(score) {

        const user = this.auth.currentUser;
        if (!user) return;

        const ref = doc(db, "leaderboard", user.uid);

await setDoc(ref, {
    username: user.displayName || user.email,
    score: score,
    avatar: user.photoURL || ""
}, { merge: true });

    }

    async getTopScores(limitCount = 5) {

        const q = query(
            this.collection,
            orderBy("score", "desc"),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);

        const scores = [];

        snapshot.forEach(doc => {
            scores.push(doc.data());
        });

        return scores;
    }

    async display() {

        const scores = await this.getTopScores();

        const list = document.getElementById("leaderboard");

        list.innerHTML = "";

        scores.forEach((s, i) => {

            const li = document.createElement("li");

            li.innerText = `${i+1}. ${s.username} : ${s.score}`;

            list.appendChild(li);

        });

    }
}
