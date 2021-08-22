// Welcome to Tetris by David Bedoya and Luisa Fernanda

// We use the window.onload syntax to call a function(init) every time the page loads.
// We use the init() function to bring the 'icon' element and then add the class 'fa-pause' to it.
// At the end we call the function showStarting() to display a start message on the canvas.
window.onload = init;
function init(){
    const icon = document.getElementById('icon');
    icon.classList.add('fa-pause');
    showStarting()
}

// We generate a random integer number
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// We generate a sequence in a random list
function generateSequence() {
    const sequence = ["I", "J", "L", "O", "S", "T", "Z", "Y", "U"];

    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}

// First we check that the sequence list is not empty. In such case we call the function generateSequence() to generate another random sequence.
// Evaluates the next part you save and removes them from the sequence list.
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

// we use this function to rotate the pieces.
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );

    return result;
}


// Evaluate if the movements of the pieces are invalid or not.
function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (
                matrix[row][col] && (cellCol + col < 0 ||
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

// Message before starting the game
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

// Game Over Message
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

// Declaration of variables
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
const points = document.getElementById('points')
const record = document.getElementById('record')


// Assignment of click event to the three buttons
start.addEventListener('click',play);
light.addEventListener('click',lightSide);
dark.addEventListener('click',darkSide);

// Assigned function to start the game
function play(){
    rAF = requestAnimationFrame(loop);
}

// Assigned function to restart the game
function toReset(){
    location.reload();
    // // context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    // cancelAnimationFrame(rAF);
    // context.clearRect(canvas.width, canvas.height);
    // // loop()
    // count = 0;
    // tetromino = getNextTetromino();
    // rAF = null; 
    // gameOver = false;
    // score = 0;
    // canvas = document.getElementById("game");
    // context = canvas.getContext("2d");
    // grid = 32;
    // tetrominoSequence = [];
    // playfield = [];
    // cellCol = 0;
    // cellRow = 0;
    // matrix = 0;
    // playfield[row][col] = 0;
}

// Assigned function to switch to dark mode
function darkSide(){
    body.classList.add("active")
    canvas.classList.add("active")
    playButton.classList.add("active")
    resetButton.classList.add("active")
}


// Assigned function to switch to light mode
function lightSide(){
    body.classList.remove("active")
    canvas.classList.remove("active")
    playButton.classList.remove("active")
    resetButton.classList.remove("active")
}

// Nested for loop to evaluate if parts top out or complete a row
for (let row = -2; row < 20; row++) {
    playfield[row] = [];
    
    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

// Array for save the pieces
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

// Array to save the colors of the pieces    
const colors = {
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


// Initialized variables
let count = 0;
let tetromino = getNextTetromino();
let rAF = null; 
let gameOver = false;
let score = 0;
    


// Function that executes the animation of each piece on the board which is repeated
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

// Assign the up, down, right and left keys to the corresponding functions
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

// Function to Pause and continue the game and remove the icon
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