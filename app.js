let gameSeq = [];
let userSeq = [];

let btns = ['yellow', 'red', 'purple', 'green'];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");

// 🔊 1. SETUP BACKGROUND MUSIC (Global Variable)
// We define it outside so we can pause it later
let bgMusic = new Audio("Sounds/bgm.mp3");
bgMusic.loop = true; // Makes the music repeat forever
bgMusic.volume = 0.5; // Set volume to 50%

// 🔊 2. HELPER FUNCTION FOR SOUND EFFECTS
function playSound(name) {
    let audio = new Audio(`Sounds/${name}.mp3`);
    audio.play();
}

function startGame() {
    if (started == false) {
        console.log("game is started");

        // 🔊 3. PLAY START SOUND & BACKGROUND MUSIC
        playSound("start");
        bgMusic.play().catch(e => console.log("Audio play failed: ", e)); // Safety catch
        
        // IMPORTANT: We set 'started' to true after a tiny delay (100ms).
        // This prevents the touch that starts the game from ALSO being counted 
        // as a button click immediately.
        setTimeout(function() {
             started = true;
             levelUp();
        }, 100); 
    }
}

// 1. Listen for Keyboard (Desktop)
document.addEventListener('keypress', startGame);

// 2. Listen for Touch/Click (Mobile)
// We add this to the 'h2' or 'body' so mobile users can tap to start
document.addEventListener('touchstart', startGame);

function gameFlash(btn) {
    btn.classList.add('flash');
    setTimeout(function () {
        btn.classList.remove('flash');
    }, 250);
}

function userFlash(btn) {
    btn.classList.add('userflash');
    setTimeout(function () {
        btn.classList.remove('userflash');
    }, 250);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);

    gameSeq.push(randColor);
    console.log("game seq: ", gameSeq);

    gameFlash(randBtn);
};

function checkAns(idx) {
    if (userSeq[idx] == gameSeq[idx]) {
        // 2. ONLY Level Up if the user has finished the entire sequence
        if (userSeq.length === gameSeq.length) {
            // ✅ Case A: Level Completed (Victory!)
            // We wait 250ms, then play Level Up sound (No click sound)
            setTimeout(function () {
                playSound("levelup");
            }, 250);

            setTimeout(levelUp, 1000);
        } else {
            // ✅ Case B: Middle of sequence (Normal)
            // Play the normal click sound immediately
            playSound("click");
        }

    } else {
        // Game Over Logic
        h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> Press any key to start the game`;
        // 1. Add the red "Game Over" background class
        document.querySelector("body").classList.add("game-over");

        // 2. Remove it after 200ms (milliseconds)
        setTimeout(function () {
            document.querySelector("body").classList.remove("game-over");
        }, 200);
        reset();
    }
}

function btnPress() {
    if (started) {
        let btn = this;
        userFlash(btn);

        let userColor = btn.getAttribute("id");
        userSeq.push(userColor);
        console.log("game seq: ", gameSeq);

        checkAns(userSeq.length - 1);
    }
}

let allBtns = document.querySelectorAll(".btn");
for (const btn of allBtns) {
    btn.addEventListener('click', btnPress);
}

let highestScore = 0;
let scoreDisplay = document.querySelector(".score");
function reset() {
    started = false;

    if (highestScore < level) {
        highestScore = level;
    }

    scoreDisplay.innerHTML = `Your Highest Score: <b>${highestScore}</b>`;

    level = 0;
    gameSeq = [];
    userSeq = [];
}

