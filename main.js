let gridSize = 50;
let snake;
let gameMode = null; // 'ai' atau 'manual'
let gameStarted = false;
let timerInterval = null;
let elapsedTime = 0;
let lastFrameTime = 0;
let currentSpeed = 8; // default normal
let recordScore = 0;
let recordTime = 0;
let leaderboard = [];
let isPaused = false;

function startGame(mode) {
    gameMode = mode;
    gameStarted = true;
    document.getElementById('dashboard').style.display = 'none';
    restartGame();
    startTimer();
}

function startTimer() {
    elapsedTime = 0;
    updateTimerDisplay();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        elapsedTime += 0.1;
        updateTimerDisplay();
    }, 100);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function updateTimerDisplay() {
    document.getElementById('timer').innerText = "Time: " + elapsedTime.toFixed(1) + "s";
}

function setup() {
    createCanvas(1000, 900); // Perluas bidang petak game
    frameRate(8);
    // Jangan mulai game sebelum memilih mode
}

function draw() {
    background(30, 30, 40);

    // Gambar grid
    stroke(60, 60, 80, 80);
    strokeWeight(1);
    for(let x=0; x<width; x+=gridSize) {
        line(x, 0, x, height);
    }
    for(let y=0; y<height; y+=gridSize) {
        line(0, y, width, y);
    }

    if (gameStarted && !isPaused) {
        snake.move();
        snake.draw();
    } else if (gameStarted && isPaused) {
        snake.draw();
        // Notifikasi game paused di depan
        push();
        fill(30,30,40,220);
        rectMode(CENTER);
        rect(width/2, height/2, 420, 150, 24);
        fill(40, 180, 255);
        textAlign(CENTER, CENTER);
        textSize(48);
        text('PAUSED', width/2, height/2-25);
        fill(255);
        textSize(24);
        text('Tekan SPASI untuk melanjutkan', width/2, height/2+30);
        pop();
    }
}

function pauseGame() {
    isPaused = true;
    frameRate(0);
    stopTimer();
}

function resumeGame() {
    isPaused = false;
    frameRate(currentSpeed);
    startTimer();
}

function keyPressed() {
    if (!gameStarted) return;
    if (keyCode === 32) { // Spasi untuk pause/resume
        if (!isPaused) {
            pauseGame();
        } else {
            resumeGame();
        }
        return;
    }
    if (isPaused) return;
    if(gameMode === 'manual') {
        if(keyCode == LEFT_ARROW) {
            snake.changeDirection(DIRECTION.LEFT);
        } else if(keyCode == RIGHT_ARROW) {
            snake.changeDirection(DIRECTION.RIGHT);
        } else if(keyCode == UP_ARROW) {
            snake.changeDirection(DIRECTION.UP);
        } else if(keyCode == DOWN_ARROW) {
            snake.changeDirection(DIRECTION.DOWN);
        }
    }
    if(keyCode == 27) { // ESC
        frameRate(0);
    } else if(keyCode == 80) { // P
        frameRate(8);
    }
}

function drawBox(x, y) {
    let maxCol = Math.floor(width / gridSize);
    let maxRow = Math.floor(height / gridSize);

    if(x >= 0 && x < maxCol && y >= 0 && y < maxRow) {
        // Tambahkan efek rounded dan warna
        stroke(40, 40, 40, 120);
        strokeWeight(2);
        fill(50, 200, 70, 220);
        rect(x * gridSize + 4, y * gridSize + 4, gridSize - 8, gridSize - 8, 12);
    }
}

function updateScore(score) {
    document.getElementById('score').innerText = "Score: " + score;
}

function updateRecordUI() {
    const recordDiv = document.getElementById('record');
    if (recordScore > 0) {
        recordDiv.style.display = 'block';
        recordDiv.innerText = `Record: ${recordScore} (Time: ${recordTime.toFixed(1)}s)`;
    } else {
        recordDiv.style.display = 'none';
    }
}

function updateLeaderboardUI() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    leaderboard.slice(0, 10).forEach((entry, idx) => {
        const li = document.createElement('li');
        li.textContent = `Score: ${entry.score} | Time: ${entry.time.toFixed(1)}s`;
        if (idx === 0) li.style.color = '#ffd700';
        list.appendChild(li);
    });
}

function showGameOver(score) {
    document.getElementById('gameover').style.display = 'block';
    document.getElementById('finalscore').innerText = `Score: ${score} | Time: ${elapsedTime.toFixed(1)}s`;
    // Update record jika skor lebih tinggi, atau skor sama tapi waktu lebih cepat
    let isNewRecord = false;
    if (
        score > recordScore ||
        (score === recordScore && (elapsedTime < recordTime || recordTime === 0))
    ) {
        recordScore = score;
        recordTime = elapsedTime;
        isNewRecord = true;
    }
    updateRecordUI();
    document.getElementById('finalrecord').innerText =
        recordScore > 0 ? `Record: ${recordScore} (Time: ${recordTime.toFixed(1)}s)` + (isNewRecord ? '  ⭐' : '') : '';
    // Tambahkan ke leaderboard
    leaderboard.push({ score: score, time: elapsedTime });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    updateLeaderboardUI();
    stopTimer();
}

function restartGame() {
    document.getElementById('gameover').style.display = 'none';
    snake = new Snake();
    frameRate(currentSpeed);
    updateScore(0);
    elapsedTime = 0;
    updateTimerDisplay();
    stopTimer();
    if (gameStarted) startTimer();
}

function backToDashboard() {
    document.getElementById('gameover').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    gameStarted = false;
    stopTimer();
}

function finishGame() {
    document.getElementById('gameover').style.display = 'none';
    gameStarted = false;
    stopTimer();
}

window.addEventListener('DOMContentLoaded', () => {
    updateRecordUI();
    updateLeaderboardUI();
    const speedSelect = document.getElementById('speedSelect');
    if (speedSelect) {
        speedSelect.value = currentSpeed;
        speedSelect.addEventListener('change', function() {
            currentSpeed = parseInt(this.value);
            frameRate(currentSpeed);
        });
    }
    // Reset leaderboard
    const resetBtn = document.getElementById('resetLeaderboardBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            leaderboard = [];
            updateLeaderboardUI();
        });
    }
    // Theme slider
    const themeSlider = document.getElementById('themeSlider');
    const themeLabel = document.getElementById('themeLabel');
    if (themeSlider) {
        themeSlider.addEventListener('input', function() {
            if (this.value == '1') {
                document.body.style.background = '#fff';
                document.body.style.color = '#232336';
                themeLabel.textContent = 'White';
                document.getElementById('leaderboard').style.background = 'rgba(255,255,255,0.92)';
                document.getElementById('leaderboard').style.color = '#232336';
                document.getElementById('controls').style.background = 'rgba(220,220,220,0.85)';
                document.getElementById('score').style.background = 'rgba(220,220,220,0.85)';
                document.getElementById('score').style.color = '#232336';
                document.getElementById('controls').style.color = '#232336';
            } else {
                document.body.style.background = '#232336';
                document.body.style.color = '#fff';
                themeLabel.textContent = 'Dark';
                document.getElementById('leaderboard').style.background = 'rgba(40,40,60,0.92)';
                document.getElementById('leaderboard').style.color = '#fff';
                document.getElementById('controls').style.background = 'rgba(40,40,60,0.85)';
                document.getElementById('score').style.background = 'rgba(40,40,60,0.85)';
                document.getElementById('score').style.color = '#fff';
                document.getElementById('controls').style.color = '#fff';
            }
        });
    }
});

