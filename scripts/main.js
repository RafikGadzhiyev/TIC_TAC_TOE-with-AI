const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const winPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const AI_PLAYER = 'O';
const HUMAN_PLAYER = 'X';

let currentPlayerMark = HUMAN_PLAYER;

const gameField = document.querySelector('.game-container');
const gameCells = document.querySelectorAll('.cells');


gameCells.forEach((gameCell, index) => {
    gameCell.onclick = () => {
        if (typeof board[index] === 'string') return;
        gameCell.textContent = currentPlayerMark;
        board[index] = currentPlayerMark;
        if (checkWin(board, currentPlayerMark, winPositions)) {
            alert('Human win!')
        }
        currentPlayerMark = AI_PLAYER;
        const bestAIMove = minimax(board, AI_PLAYER);

        board[bestAIMove.index] = currentPlayerMark;
        if (bestAIMove.score === 0 && bestAIMove.index == undefined) {
            alert('Draw');
            return;
        }
        gameCells[bestAIMove.index].textContent = currentPlayerMark;

        if (checkWin(board, currentPlayerMark, winPositions)) {
            alert('AI beat you!')
        }
        currentPlayerMark = HUMAN_PLAYER;
    }
})

function getEmptyCells(board) {
    return board.filter(e => typeof e === 'number')
}

function checkWin(board, mark, winPositions) {
    for (let winPosition of winPositions) {
        if (board[winPosition[0]] === mark && board[winPosition[1]] === mark && board[winPosition[2]] === mark) return true;
    }

    return false;
}

function minimax(currBdSt, currMark, depth = 1) {
    // getting all empty cells
    const availCellsIndexes = getEmptyCells(currBdSt);

    // creating terminal state
    if (checkWin(currBdSt, HUMAN_PLAYER, winPositions)) {
        return { score: -100 + depth };
    } else if (checkWin(currBdSt, AI_PLAYER, winPositions)) {
        return { score: 100 - depth };
    } else if (availCellsIndexes.length === 0) {
        return { score: 0 };
    }

    // container which will contains all tested emptry cells
    const allTestPlayInfos = [];

    // looping through all empty cells
    for (let i = 0; i < availCellsIndexes.length; i++) {
        // creating object which store data about current tested empty cell
        const currentTestPlayInfo = {};
        // setting current empty cell index
        currentTestPlayInfo.index = availCellsIndexes[i];
        // temporary setting mark to our board
        currBdSt[availCellsIndexes[i]] = currMark;

        // Recursively checking another cells
        // If current test was with AI next will be with Human
        if (currMark === AI_PLAYER) {
            // Calling next text with Human
            currentTestPlayInfo.score = minimax(currBdSt, HUMAN_PLAYER, depth + 1).score;
        } else {
            // Calling next text with AI
            currentTestPlayInfo.score = minimax(currBdSt, AI_PLAYER, depth + 1).score;
        }
        // Remove temporary setted mark
        currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;

        // Pushing tested cell data into container
        allTestPlayInfos.push(currentTestPlayInfo);
    }

    // Creating best move data 
    let bestTestPlay = {
        index: -1,
        score: currMark === AI_PLAYER ? -Infinity : Infinity
    };

    // looping through all tested Cells
    for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (currMark === AI_PLAYER) {
            if (allTestPlayInfos[i].score > bestTestPlay.score) {
                bestTestPlay.score = allTestPlayInfos[i].score;
                bestTestPlay.index = i;
            }
        }
        else {
            if (allTestPlayInfos[i].score < bestTestPlay.score) {
                bestTestPlay.score = allTestPlayInfos[i].score;
                bestTestPlay.index = i;
            }
        }
    }

    return allTestPlayInfos[bestTestPlay.index];
}