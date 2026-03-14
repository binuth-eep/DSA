// js/puzzleService.js
class PuzzleService {
    static async fetchChallenge() {
        try {
            const r = await fetch('https://marcconrad.com/uob/heart/api.php?out=json');
            return await r.json();
        } catch {
            return { question: '', solution: 42 };
        }
    }
}