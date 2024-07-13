const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');
const playWithBotButton = document.getElementById('playWithBotButton');
const playWithHumanButton = document.getElementById('playWithHumanButton');
const welcomeScreen = document.getElementById('welcomeScreen');
const modeSelectionScreen = document.getElementById('modeSelectionScreen');
const gameScreen = document.getElementById('gameScreen');
const endScreen = document.getElementById('endScreen');
const endMessage = document.getElementById('endMessage');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
let circleTurn;
let isBotGame = false;

startButton.addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    modeSelectionScreen.classList.add('active');
});

playWithBotButton.addEventListener('click', () => {
    isBotGame = true;
    modeSelectionScreen.classList.remove('active');
    gameScreen.classList.add('active');
    startGame();
});

playWithHumanButton.addEventListener('click', () => {
    isBotGame = false;
    modeSelectionScreen.classList.remove('active');
    gameScreen.classList.add('active');
    startGame();
});

restartButton.addEventListener('click', () => {
    endScreen.classList.remove('active');
    modeSelectionScreen.classList.add('active');
    resetGame();
});

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
}

function resetGame() {
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
    });
    endScreen.classList.remove('active');
    modeSelectionScreen.classList.add('active');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (isBotGame && circleTurn) {
            setTimeout(botMove, 500);
        }
    }
}

function endGame(draw) {
    if (draw) {
        endMessage.textContent = 'Draw!';
        drawSound.play();
    } else {
        endMessage.textContent = `${circleTurn ? "O's" : "X's"} Wins!`;
        winSound.play();
    }
    gameScreen.classList.remove('active');
    endScreen.classList.add('active');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    clickSound.play();
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function botMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS);
    });

    if (availableCells.length === 0) return;

    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < availableCells.length; i++) {
        const cell = availableCells[i];
        cell.classList.add(CIRCLE_CLASS);
        const score = minimax(0, false);
        cell.classList.remove(CIRCLE_CLASS);
        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    }
    placeMark(bestMove, CIRCLE_CLASS);

    if (checkWin(CIRCLE_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function minimax(depth, isMaximizing) {
    if (checkWin(X_CLASS)) {
        return -10;
    } else if (checkWin(CIRCLE_CLASS)) {
        return 10;
    } else if (isDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < cellElements.length; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(CIRCLE_CLASS);
                const score = minimax(depth + 1, false);
                cellElements[i].classList.remove(CIRCLE_CLASS);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < cellElements.length; i++) {
            if (!cellElements[i].classList.contains(X_CLASS) && !cellElements[i].classList.contains(CIRCLE_CLASS)) {
                cellElements[i].classList.add(X_CLASS);
                const score = minimax(depth + 1, true);
                cellElements[i].classList.remove(X_CLASS);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
