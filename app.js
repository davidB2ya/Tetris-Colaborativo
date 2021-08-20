window.onload = init;
function init(){
    const icon = document.getElementById('icon');
    icon.classList.add('fa-pause');
    showStarting()
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateSequence() {
    const sequence = ["I", "J", "L", "O", "S", "T", "Z", "Y", "U"];

    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}


function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    const col =
        playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    
    const row = name === "I" ? -1 : -2;

    return {
        name: name, // 
        matrix: matrix, 
        row: row, 
        col: col, 
    };
}


function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );

    return result;
}


function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (
                matrix[row][col] &&
                
                (cellCol + col < 0 ||
                    cellCol + col >= playfield[0].length ||
                    cellRow + row >= playfield.length ||
                    
                    playfield[cellRow + row][cellCol + col])
            ) {
                return false;
            }
        }
    }

    return true;
}

function placeTetromino() {
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (
            let col = 0;
            col < tetromino.matrix[row].length;
            col++
        ) {
            if (tetromino.matrix[row][col]) {
                
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }

                playfield[tetromino.row + row][
                    tetromino.col + col
                ] = tetromino.name;
            }
        }
    }

    
    for (let row = playfield.length - 1; row >= 0; ) {
        if (playfield[row].every((cell) => !!cell)) {
            // drop every row above this one
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
        } else {
            row--;
        }
    }

    tetromino = getNextTetromino();
}

function showStarting() {
    context.fillStyle = "black";
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = "white";
    context.font = "40px pixel";
    context.fontfamily = "pixel";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
        "Starting...!",
        canvas.width / 2,
        canvas.height / 2
    );
}

function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = "black";
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

    context.globalAlpha = 1;
    context.fillStyle = "white";
    context.font = "40px pixel";
    context.fontfamily = "pixel";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
        "GAME OVER!",
        canvas.width / 2,
        canvas.height / 2
    );
}

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const grid = 32;
const tetrominoSequence = [];
const playfield = [];
const start = document.getElementById("button-start");
const light = document.getElementById("light");
const dark = document.getElementById("dark");
const body = document.getElementById("body");
const playButton = document.getElementById('play')
const resetButton = document.getElementById('reset')


start.addEventListener('click',play);
light.addEventListener('click',lightSide);
dark.addEventListener('click',darkSide);

function play(){
    rAF = requestAnimationFrame(loop);
}

function toReset(){
    location.reload();
}

function darkSide(){
    body.classList.add("active")
    canvas.classList.add("active")
    playButton.classList.add("active")
    resetButton.classList.add("active")
}

function lightSide(){
    body.classList.remove("active")
    canvas.classList.remove("active")
    playButton.classList.remove("active")
    resetButton.classList.remove("active")
}


for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}


const tetrominos = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    Y: [
        [1, 0, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    U: [
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
    ]
};

            
const colors = {
    // I: "cyan",
    // O: "yellow",
    // T: "purple",
    // S: "green",
    // Z: "red",
    // J: "blue",
    // L: "orange",
    // Y: "lawngreen",
    // U: "deeppink"
        
    I: "#e74c3c",
    O: "#8e44ad",
    T: "#3498db",
    S: "#e67e22",
    Z: "#32c06d",
    J: "rgb(41, 41, 204)",
    L: "rgb(240, 227, 57)",
    Y: "rgb(138, 230, 47)",
    U: "rgb(199, 45, 127)"
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null; 
let gameOver = false;

            
function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];

                
                context.fillRect(
                    col * grid,
                    row * grid,
                    grid - 1,
                    grid - 1
                );
            }
        }
    }

    
    if (tetromino) {
        
        if (++count > 35) {
            tetromino.row++;
            count = 0;

            
            if (
                !isValidMove(
                    tetromino.matrix,
                    tetromino.row,
                    tetromino.col
                )
            ) {
                tetromino.row--;
                placeTetromino();
            }
        }

        context.fillStyle = colors[tetromino.name];

        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (
                let col = 0;
                col < tetromino.matrix[row].length;
                col++
            ) {
                if (tetromino.matrix[row][col]) {
                    
                    context.fillRect(
                        (tetromino.col + col) * grid,
                        (tetromino.row + row) * grid,
                        grid - 1,
                        grid - 1
                    );
                }
            }
        }
    }
}


document.addEventListener("keydown", function (e) {
    if (gameOver) return;
    if (e.which === 37 || e.which === 39) {
        const col =
            e.which === 37 ? tetromino.col - 1 : tetromino.col + 1;

        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    
    if (e.which === 38) {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    
    if (e.which === 40) {
        const row = tetromino.row + 1;

        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;

            placeTetromino();
            return;
        }

        tetromino.row = row;
    }
});


            



const playPause = () => {
    const isPaused = !icon.classList.contains('fa-pause');
    if (isPaused) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        rAF = requestAnimationFrame(loop);
        
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        cancelAnimationFrame(rAF);
        
    }
}
