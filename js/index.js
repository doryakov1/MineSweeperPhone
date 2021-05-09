'use strict';

const MINE = '☠️';
const FLAG = '🚩';
const LIFE = '❤️';
const FACEPLAY = '😊';
const FACEWIN = '😀';
const FACELOSE = '😵';
const FACEWINGAME = '😎';
const FACELOSEGAME = '😩';

var gFlag;
var gTimer;
var gFace = FACEPLAY;
var gBoard = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,

};

var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lifes: 3
}

function resetGame() {
    gFace = FACEPLAY;
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gGame.lifes = 3;
    clearInterval(gTimer);
}

function init() {
    resetGame()
    gBoard = buildBoard();
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return board;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        board[getRandomIntInclusive(0, gLevel.SIZE - 1)][getRandomIntInclusive(0, gLevel.SIZE - 1)].isMine = true;
    }
}

function checkGameOver(idx, jdx) {
    if (!gGame.lifes) {
        clearInterval(gTimer);
        gGame.isOn = false;
        gFace = `${FACELOSEGAME}`;
        revalMines(idx, jdx)
        renderBoard(gBoard);
        return 1;
    }
    if ((gLevel.SIZE * gLevel.SIZE) - gLevel.MINES === gGame.shownCount && gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false;
        clearInterval(gTimer);
        gFace = `${FACEWIN}`;
        renderBoard(gBoard);
        return 1;
    }
    return;
}

function renderBoard(board) {
    var life = '';
    var cell;
    var strHTML = '<table ><tbody>';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (board[i][j].isShown) {
                var shownClassName = ' ';
                if (board[i][j].isMine) {
                    cell = MINE;
                } else {
                    if (board[i][j].minesAroundCount) {
                        cell = board[i][j].minesAroundCount;
                        var MinesClassName = 'mines-' + board[i][j].minesAroundCount;
                    } else {
                        cell = '';
                        var MinesClassName = '';
                    }
                }
            } else if (board[i][j].isMarked) {
                cell = FLAG;
                var shownClassName = '';
                var MinesClassName = '';
            } else {
                cell = '';
                var shownClassName = 'unshown-cell';
                var MinesClassName = '';
            }
            var className = 'cell cell' + i + '-' + j;
            strHTML += '<td class="' + className + ' ' + shownClassName + ' ' + MinesClassName + ' "onmousedown="cellClicked(event,' + i + ',' + j + ')"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elFlag = document.querySelector(`.flags`);
    var elContainer = document.querySelector(`.board-container`);
    var elMarkedSpan = document.querySelector(`.marked`);
    var elShownSpan = document.querySelector(`.showen-counts`);
    var elFaceSpan = document.querySelector(`.face-show`);
    var elLifesSpan = document.querySelector(`.lifes-counts`);
    for (var i = 0; i < gGame.lifes; i++) {
        life += LIFE;
    }
    if (gFlag) {
        elFlag.textContent = '🚩 On';
    } else {
        elFlag.textContent = '🚩 Off';

    }
    elLifesSpan.innerHTML = life;
    elFaceSpan.innerHTML = gFace;
    elMarkedSpan.innerHTML = 'Flags: ' + gGame.markedCount;
    elShownSpan.innerHTML = 'Shown: ' + gGame.shownCount;
    elContainer.innerHTML = strHTML;
}

function cellClicked(event, idx, jdx) {
    if (!gGame.isOn && gGame.shownCount > 0) return;
    if (gFlag) {
        if (gGame.isOn) {
            cellMarked(idx, jdx)
            checkGameOver(idx, jdx)
            return;

        } else {
            gFlag = 0;
            return;
        }
    }
    if (event.button == 0 && !gBoard[idx][jdx].isMarked) {
        if (gBoard[idx][jdx].isMine) {
            if (gGame.isOn) {
                gGame.lifes--;
                if (checkGameOver(idx, jdx)) {
                    return;
                }
                gFace = FACELOSE;
                gBoard[idx][jdx].isShown = true;
                renderBoard(gBoard)
                setTimeout(() => {
                    gFace = FACEPLAY;
                    gBoard[idx][jdx].isShown = false;
                    renderBoard(gBoard);
                }, 500);

            } else {
                init()
            }
            return;
        }
        if (gBoard[idx][jdx].isShown) {
            return;
        }
        if (gBoard[idx][jdx].isMarked) {
            return;
        }
        if (countNeighbors(idx, jdx, gBoard)) {
            if (!gGame.isOn) {
                gGame.isOn = true;
                gTimer = setInterval(myTimer, 1000);
            }
            gFace = FACEWIN;
            gBoard[idx][jdx].isShown = true;
            gGame.shownCount++;
            gBoard[idx][jdx].minesAroundCount = countNeighbors(idx, jdx, gBoard);
            renderBoard(gBoard)
            setTimeout(() => {
                gFace = FACEPLAY;
                renderBoard(gBoard);
            }, 500);
            checkGameOver(idx, jdx)
            return;
        }
        if (!gGame.isOn) {
            gGame.isOn = true;
            gTimer = setInterval(myTimer, 1000);
        }
        gFace = FACEWIN;
        gBoard[idx][jdx].isShown = true;
        gGame.shownCount++;
        gBoard[idx][jdx].minesAroundCount = countNeighbors(idx, jdx, gBoard)
        renderBoard(gBoard)
        setTimeout(() => {
            gFace = FACEPLAY;
            renderBoard(gBoard);
        }, 500);
        expandShown(idx, jdx)
        checkGameOver(idx, jdx)
    } else if (event.button == 2) {
        if (gGame.isOn) {
            cellMarked(idx, jdx)
            checkGameOver(idx, jdx)

        }

    }
}

function cellMarked(idx, jdx) {
    gFlag = 0;
    if (gBoard[idx][jdx].isShown) {
        return;
    }
    if (gBoard[idx][jdx].isMarked) {
        gBoard[idx][jdx].isMarked = false;
        gGame.markedCount--;
        renderBoard(gBoard)
        return
    } else {
        gBoard[idx][jdx].isMarked = true;
        gGame.markedCount++;
        renderBoard(gBoard)
    }
}

function expandShown(idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (gBoard[i][j].isMine) break;
            if (gBoard[i][j].isMarked) break;
            if (gBoard[i][j].isShown) continue;
            gBoard[i][j].isShown = true;
            gGame.shownCount++;
            gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard)
            renderBoard(gBoard)
            if (!gBoard[i][j].minesAroundCount) {
                expandShown(i, j)
            }
        }
    }
}

function countNeighbors(idx, jdx, borad) {
    var neighborsCount = 0;
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (i === idx && j === jdx) continue;
            if (j < 0 || j >= gLevel.SIZE) continue;
            if (borad[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function levels(level) {

    if (level === 'beginner') {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
        init()
        return;
    }
    if (level === 'medium') {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
        init()
        return;
    }
    if (level === 'expert') {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
        init()
        return;
    }
}

function myTimer() {
    var elTimerSpan = document.querySelector(`.time`);
    elTimerSpan.innerHTML = 'Time: ' + gGame.secsPassed++;
}

function setFlag() {
    gFlag = 1;
    renderBoard(gBoard);
    return;
}

function revalMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    renderBoard(gBoard);
}