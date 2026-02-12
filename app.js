
// ==========================================
// FLOATING HEARTS BACKGROUND
// ==========================================
function createFloatingHeart() {
    const container = document.getElementById('floating-hearts-container');
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '💖';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    container.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 7000);
}

setInterval(createFloatingHeart, 500);

// ==========================================
// MUSIC PLAYER
// ==========================================
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicIcon.textContent = '▶️';
    } else {
        music.play();
        musicIcon.textContent = '⏸️';
    }
    isPlaying = !isPlaying;
});

// ==========================================
// PROPOSAL SECTION - MOVING "NO" BUTTON
// ==========================================
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const questionContainer = document.getElementById('question-container');
const successMessage = document.getElementById('success-message');
const successModal = document.getElementById('success-modal');
const buttonsContainer = document.getElementById('buttons-container');

// Position Yes button in center initially
yesButton.style.position = 'relative';
yesButton.style.margin = '0 auto';
yesButton.style.display = 'block';

// Position No button initially
noButton.style.left = '50%';
noButton.style.top = '80px';
noButton.style.transform = 'translateX(-50%)';

// Move No button on hover and click
function moveNoButton() {
    const container = buttonsContainer.getBoundingClientRect();
    const button = noButton.getBoundingClientRect();

    const maxX = container.width - button.width - 20;
    const maxY = container.height - button.height - 20;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    noButton.style.left = randomX + 'px';
    noButton.style.top = randomY + 'px';
    noButton.style.transform = 'none';

    // Add shake animation to question
    questionContainer.classList.add('shake-animation');
    setTimeout(() => {
        questionContainer.classList.remove('shake-animation');
    }, 500);
}

noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('click', moveNoButton);
noButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Yes button click
yesButton.addEventListener('click', () => {
    // Hide question
    questionContainer.classList.add('hidden');
    successMessage.classList.remove('hidden');

    // Show modal
    successModal.classList.add('active');

    // Trigger confetti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ff69b4']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ff69b4']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // Hide modal after 3 seconds
    setTimeout(() => {
        successModal.classList.remove('active');
    }, 3000);
});

// ==========================================
// ENVELOPE LETTER
// ==========================================
const envelope = document.getElementById('envelope');
const envelopeFlap = document.getElementById('envelope-flap');
const letter = document.getElementById('letter');
let isOpen = false;

envelope.addEventListener('click', () => {
    if (!isOpen) {
        envelopeFlap.classList.add('open');
        setTimeout(() => {
            letter.classList.add('show');
        }, 300);
        isOpen = true;
    } else {
        letter.classList.remove('show');
        setTimeout(() => {
            envelopeFlap.classList.remove('open');
        }, 300);
        isOpen = false;
    }
});

// ==========================================
// LOVE CALCULATOR
// ==========================================
const calculateBtn = document.getElementById('calculate-love');
const loveResult = document.getElementById('love-result');
const lovePercentage = document.getElementById('love-percentage');
const loveMessage = document.getElementById('love-message');

calculateBtn.addEventListener('click', () => {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();

    if (name1 === '' || name2 === '') {
        alert('Please enter both names! 💕');
        return;
    }

    // Calculate "random" percentage based on names (always high!)
    const combined = name1.toLowerCase() + name2.toLowerCase();
    let sum = 0;
    for (let char of combined) {
        sum += char.charCodeAt(0);
    }

    // Ensure percentage is always between 85-100%
    let percentage = (sum % 16) + 90;

    loveResult.classList.remove('hidden');

    // Animate percentage
    let current = 0;
    const interval = setInterval(() => {
        current++;
        lovePercentage.textContent = current;
        if (current >= percentage) {
            clearInterval(interval);
        }
    }, 20);

    // Set message based on percentage
    if (percentage >= 95) {
        loveMessage.textContent = '💕 Perfect Match! You two are meant to be! 💕';
    } else if (percentage >= 90) {
        loveMessage.textContent = '💖 Amazing Connection! True love is here! 💖';
    } else {
        loveMessage.textContent = '💗 Great Chemistry! Love is in the air! 💗';
    }

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff69b4', '#ff1493', '#ffc0cb']
    });
});

// ==========================================
// CATCH THE HEART GAME
// ==========================================
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startGameBtn = document.getElementById('start-game');
const gameScoreEl = document.getElementById('game-score');
const gameTimeEl = document.getElementById('game-time');
const gameOverMessage = document.getElementById('game-over-message');
const finalMessage = document.getElementById('final-message');

let hearts = [];
let score = 0;
let timeLeft = 30;
let gameInterval;
let spawnInterval;
let gameActive = false;

// Responsive canvas
function resizeCanvas() {
    const container = canvas.parentElement;
    const maxWidth = Math.min(600, container.clientWidth - 40);
    canvas.width = maxWidth;
    canvas.height = maxWidth * 0.67; // maintain aspect ratio
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Heart {
    constructor() {
        this.x = Math.random() * (canvas.width - 30);
        this.y = -30;
        this.speed = Math.random() * 2 + 2;
        this.size = 25;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.font = this.size + 'px Arial';
        ctx.fillText('💖', this.x, this.y);
    }

    isClicked(mouseX, mouseY) {
        return mouseX >= this.x &&
            mouseX <= this.x + this.size &&
            mouseY >= this.y - this.size &&
            mouseY <= this.y;
    }
}

function spawnHeart() {
    hearts.push(new Heart());
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach((heart, index) => {
        heart.update();
        heart.draw();

        if (heart.y > canvas.height) {
            hearts.splice(index, 1);
        }
    });
}

function startGame() {
    if (gameActive) return;

    gameActive = true;
    score = 0;
    timeLeft = 30;
    hearts = [];
    gameScoreEl.textContent = score;
    gameTimeEl.textContent = timeLeft;
    gameOverMessage.classList.add('hidden');
    startGameBtn.textContent = 'Game Running... 🎮';
    startGameBtn.disabled = true;

    spawnInterval = setInterval(spawnHeart, 800);
    gameInterval = setInterval(() => {
        gameLoop();
        timeLeft--;
        gameTimeEl.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    gameActive = false;
    hearts = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    startGameBtn.textContent = 'Play Again! 🎮';
    startGameBtn.disabled = false;

    gameOverMessage.classList.remove('hidden');

    // Special messages based on score
    if (score >= 30) {
        finalMessage.textContent = `Amazing! ${score} hearts! You're as sweet as my love for you! 💕`;
    } else if (score >= 20) {
        finalMessage.textContent = `Great job! ${score} hearts! Just like the number of reasons I love you! 💖`;
    } else if (score >= 10) {
        finalMessage.textContent = `Nice! ${score} hearts! But my love for you is infinite! 💗`;
    } else {
        finalMessage.textContent = `${score} hearts! That's okay, you already have my heart! 💝`;
    }

    confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
    });
}

canvas.addEventListener('click', (e) => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    hearts.forEach((heart, index) => {
        if (heart.isClicked(mouseX, mouseY)) {
            hearts.splice(index, 1);
            score++;
            gameScoreEl.textContent = score;

            // Mini confetti on click
            confetti({
                particleCount: 10,
                spread: 30,
                origin: {
                    x: e.clientX / window.innerWidth,
                    y: e.clientY / window.innerHeight
                },
                colors: ['#ff69b4', '#ffc0cb']
            });
        }
    });
});

startGameBtn.addEventListener('click', startGame);

// ==========================================
// COUNTDOWN TO NEXT VALENTINE'S DAY
// ==========================================
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let valentineDay = new Date(currentYear, 1, 14); // February 14

    // If Valentine's Day has passed this year, count to next year
    if (now > valentineDay) {
        valentineDay = new Date(currentYear + 1, 1, 14);
    }

    const timeRemaining = valentineDay - now;

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ==========================================
// SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// INITIAL CONFETTI ON PAGE LOAD
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#da70d6']
        });
    }, 500);
});