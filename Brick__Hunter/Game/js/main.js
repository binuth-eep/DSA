// Initialize dependencies
const audio = new AudioManager();
const data = new DataManager();
const bricks = new BrickManager(document.getElementById('bricks-container'));

const game = new Game({
    audio,
    data,
    bricks,
    onUpdateUI: (state) => {
        document.getElementById('ui-lvl').innerText = state.level;
        document.getElementById('ui-score').innerText = state.score;
        document.getElementById('ui-lives').innerText = state.lives;
        document.getElementById('ui-high').innerText = state.highScore;
    },
    onShowScreen: (screen, options = {}) => {
       
        document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
        
        if (screen === 'menu') {
            document.getElementById('menu-status').innerText = options.status || "";
            document.getElementById('screen-menu').classList.remove('hidden');
        } else if (screen === 'gameover') {
            document.getElementById('final-score').innerText = options.finalScore;
            document.getElementById('screen-gameover').classList.remove('hidden');
        }
    },
    onTriggerPuzzle: (imgUrl) => {
        document.getElementById('puzzle-img').src = imgUrl;
        document.getElementById('screen-puzzle').classList.remove('hidden');
    }
});


window.gameActions = {
    verify: () => game.verifyPuzzle(document.getElementById('puzzle-input').value),
    apply: (type) => game.applyGift(type),
    restart: () => {
        location.reload(); 
    }
};