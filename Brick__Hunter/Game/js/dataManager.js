class DataManager {
    // Get high score from cookie
    getHighScore() {
        const name = 'highScore=';
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return Number(c.substring(name.length, c.length)) || 0;
            }
        }
        return 0;
    }

    // Save high score to cookie (expires in 30 days)
    saveHighScore(score) {
        const d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
        const expires = "expires=" + d.toUTCString();
        document.cookie = "highScore=" + score + ";" + expires + ";path=/;SameSite=Lax";
    }

    // Theme methods (already using cookies — keep them)
    getTheme() {
        const m = document.cookie.match(/theme=(\d+)/);
        return m ? Number(m[1]) : 200;
    }

    setTheme(hue) {
        const d = new Date();
        d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = "theme=" + hue + ";" + expires + ";path=/;SameSite=Lax";
    }
}