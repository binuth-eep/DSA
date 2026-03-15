// js/Management/scoreService.js
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


class ScoreService {

    constructor() {
        this.db = getFirestore();
        this.auth = getAuth();
    }

    // get logged user
    getCurrentUser() {
        return this.auth.currentUser;
    }

    // save score
    async saveScore(score, level) {

        const user = this.getCurrentUser();

        if (!user) {
            console.warn("No logged user");
            return;
        }

        try {

            await addDoc(collection(this.db, "gameScores"), {

                uid: user.uid,
                email: user.email,
                score: score,
                level: level,
                createdAt: serverTimestamp()

            });

            console.log("Score saved successfully");

        } catch (error) {

            console.error("Error saving score:", error);

        }
    }

}

export default ScoreService;