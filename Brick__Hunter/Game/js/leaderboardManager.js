// js/leaderboardManager.js
class LeaderboardManager {
    constructor(auth) {
        this.auth = auth;
    }

    async getTopScores(limit = 5) {
        const response = await fetch(`php/leaderboard.php?limit=${limit}`);
        return await response.json();
    }

    async addScore(score) {
        const token = this.auth.getCurrentUser();
        if (!token) return;

        await fetch('php/submit_score.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, score })
        });
    }

    async display() {
        const scores = await this.getTopScores();
        const list = document.getElementById('leaderboard');
        list.innerHTML = '';
        scores.forEach(s => {
            const li = document.createElement('li');
            li.innerText = `${s.username}: ${s.score}`;
            list.appendChild(li);
        });
        document.getElementById('screen-leaderboard').classList.remove('hidden');
    }
}