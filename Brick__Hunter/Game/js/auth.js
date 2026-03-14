class Auth {
    constructor(game) {
        this.game = game;
        this.token = null;
        this.username = null;
    }

    async register() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!username || !password) return this.showMessage('Fill both fields');

        const res = await fetch('php/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        this.showMessage(data.message || (data.success ? 'Registered! Now login.' : 'Error'));
    }

    async login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!username || !password) return this.showMessage('Fill both fields');

        const res = await fetch('php/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (data.success) {
            this.token = data.token;
            this.username = data.username;
            document.cookie = `token=${this.token}; path=/; max-age=${7*24*60*60}; SameSite=Lax`;
            document.getElementById('screen-login').classList.add('hidden');
            document.getElementById('screen-menu').classList.remove('hidden');
            this.showMessage(`Welcome, ${username}!`);
        } else {
            this.showMessage(data.message || 'Login failed');
        }
    }

    getToken() {
        const match = document.cookie.match(/token=([^;]+)/);
        return match ? match[1] : null;
    }

    async submitScore(score) {
        const token = this.getToken();
        if (!token) return false;

        const res = await fetch('php/submit_score.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, score })
        });
        return (await res.json()).success;
    }

    async loadLeaderboard() {
        const res = await fetch('php/get_leaderboard.php');
        const data = await res.json();
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = '';

        data.forEach((entry, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i+1}</td><td>${entry.username}</td><td>${entry.score}</td>`;
            tbody.appendChild(tr);
        });

        document.getElementById('screen-leaderboard').classList.remove('hidden');
    }

    showMessage(msg) {
        document.getElementById('auth-message').textContent = msg;
    }
}