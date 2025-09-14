let paused = false;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.querySelector("#highscore").innerText = "High Score: " + highScore;

const shapes = [
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],

  [
    [1, 1],
    [1, 1],
  ],

  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],

  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],

  [
    [1, 0, 1],
    [1, 1, 1],
  ],

  [
    [1,0,0],
    [1,1,0],
    [0,1,0]
  ],

  [
    [0,1,0],
    [0,1,0],
    [1,1,0]
  ],
  
  [
    [1,1,1],
    [0,1,0],
    [0,0,0]
  ],

  [
    [0,1,0],
    [0,1,0],
    [1,1,1]
  ],

  [
    [1,1],
    [1,1],
    [0,1]
  ],

  [
    [0,0,1],
    [1,1,1],
    [1,0,0]
  ],

  [
    [1,1,1],
    [1,0,0]
  ],

  [
    [0,1,0],
    [1,1,0],
    [0,1,0],
    [0,1,0]
  ],

  [
    [1,0,0],
    [1,1,0],
    [0,1,1]
  ],

  [
    [0,1,0],
    [1,1,1],
    [0,1,0]
  ],

  [
    [1,1,0],
    [0,1,0],
    [0,1,1]
  ],

  [
    [0,1,1],
    [1,1,0],
    [0,1,0]
  ],

  [
    [1,1],
    [1,1],
    [1,1],
    [1,1]
  ]
];

const colors = [
  "#fff",
  "#9b5fe0",
  "#B69A26",
  "#5A5656",
  "#F05759",
  "#9B6B20",
  "#7DDA58",
  "#5DE2E7",
  "#807ECE",
  "#CC6CE7",
  "#F2CAD1",
  "#7D7FA9",
  "#BE90BA",
  "#763B72",
  "#E8ABF8",
  "#4B3650",
  "#D1E2E3",
  "#A89DC2",
  "#F1E8E8",
  "#E1CDD0",
  "#B7D052",
  "#E7C890"
];

const rows = 20;
const cols = 10;

let canvas = document.querySelector("#game");
let ctx = canvas.getContext("2d");
let scoreBoard = document.querySelector("h2");
console.log(ctx);
ctx.scale(30, 30);

let pieceObj = null;
let grid = generateGrid();

function generateRandomPiece() {
  let ran = Math.floor(Math.random() * 21);
  //console.log(shapes[ran]);
  let piece = shapes[ran];
  let colorIndex = ran + 1;
  let x = 4;
  let y = 0;
  return { piece, x, y, colorIndex };
}

setInterval(() => {
  if (!paused) {
    newGameState();
  }
}, 500);

function newGameState() {
  checkGrid();
  if (pieceObj == null) {
    pieceObj = generateRandomPiece();
    renderGrid();
  }
  moveDown();
}

function checkGrid() {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    let allfilled = true;
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 0) {
        allfilled = false;
      }
    }
    if (allfilled) {
      grid.splice(i, 1);
      grid.unshift(new Array(cols).fill(0));
      count++;
    }
  }

  // Scoring logic
  if (count == 1) {
    score += 10;
  } else if (count == 2) {
    score += 30;
  } else if (count == 3) {
    score += 50;
  } else if (count > 3) {
    score += count * 100;
  }

  // Update high score if needed
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    document.querySelector("#highscore").innerText = "High Score: " + highScore;
  }

  document.querySelector("#score").innerText = "Score: " + score;
}

function renderPiece() {
  let piece = pieceObj.piece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] == 1) {
        ctx.fillStyle = colors[pieceObj.colorIndex];
        ctx.fillRect(pieceObj.x + j, pieceObj.y + i, 1, 1);
      }
    }
  }
}

function moveDown() {
  if (!collision(pieceObj.x, pieceObj.y + 1)) pieceObj.y += 1;
  else {
    for (let i = 0; i < pieceObj.piece.length; i++) {
      for (let j = 0; j < pieceObj.piece[i].length; j++) {
        if (pieceObj.piece[i][j] == 1) {
          let p = pieceObj.x + j;
          let q = pieceObj.y + i;
          grid[q][p] = pieceObj.colorIndex;
        }
      }
    }
    if (pieceObj.y == 0) {
      alert("Game Over! Score: " + score);
      grid = generateGrid();
      score = 0;
      document.querySelector("#score").innerText = "Score: " + score;
    }
    pieceObj = null;
  }
  renderGrid();
}

function moveLeft() {
  if (!collision(pieceObj.x - 1, pieceObj.y)) pieceObj.x -= 1;
  renderGrid();
}

function moveRight() {
  if (!collision(pieceObj.x + 1, pieceObj.y)) pieceObj.x += 1;
  renderGrid();
}

function rotate() {
  const piece = pieceObj.piece;
  const rotatedPiece = [];

  for (let i = 0; i < piece[0].length; i++) {
    rotatedPiece[i] = [];
    for (let j = 0; j < piece.length; j++) {
      rotatedPiece[i][j] = piece[piece.length - 1 - j][i];
    }
  }

  if (!collision(pieceObj.x, pieceObj.y, rotatedPiece))
    pieceObj.piece = rotatedPiece;

  renderGrid();
}

function collision(x, y, rotatedPiece) {
  let piece = rotatedPiece || pieceObj.piece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] == 1) {
        let p = x + j;
        let q = y + i;
        if (p >= 0 && p < cols && q >= 0 && q < rows) {
          if (grid[q][p] > 0) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
  }
  return false;
}

function generateGrid() {
  let grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push([]);
    for (let j = 0; j < cols; j++) {
      grid[i].push(0);
    }
  }
  return grid;
}

canvas.addEventListener("click", () => {
  paused = !paused;
  // If game is paused, show overlay text
  if (paused) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 6, cols, 2); // slightly above middle area

    ctx.font = "1px Arial";
    ctx.fillText("PAUSED", 3, 7.5); // center-ish text
  }
});

function renderGrid() {
  // Clear and draw the current grid state
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      ctx.fillStyle = colors[grid[i][j]];
      ctx.fillRect(j, i, 1, 1);
    }
  }

  // Render the active falling piece
  renderPiece();

  
}

document.addEventListener("keydown", function (e) {
  let key = e.code;
  if (key == "ArrowDown") {
    moveDown();
  } else if (key == "ArrowLeft") {
    moveLeft();
  } else if (key == "ArrowRight") {
    moveRight();
  } else if (key == "ArrowUp") {
    rotate();
  }
});

document.querySelector("#left").addEventListener("click", moveLeft);
document.querySelector("#right").addEventListener("click", moveRight);
document.querySelector("#rotate").addEventListener("click", rotate);
document.querySelector("#down").addEventListener("click", moveDown);

if (window.innerWidth < 400) {
  canvas.width = 240; // or smaller
  canvas.height = 480;
  ctx.scale(24, 24); // smaller scale
}




