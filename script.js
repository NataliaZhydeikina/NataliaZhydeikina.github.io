const canvas = document.querySelector("canvas");
canvas.width = 256;
canvas.height = 512;

canvas.style.border = "1px solid #000";
canvas.style.display = "block";
canvas.style.margin = "10px auto";

const context = canvas.getContext("2d");

const scoreText = document.querySelector("#score");
const bestScore = document.querySelector("#best_score");
const pauseBtn = document.querySelector("#pause");
let pause = false;
pauseBtn.addEventListener("click", function () {
  pause = !pause;
});

document.addEventListener("keydown", function (event) {
  if (event.code == "KeyP") {
    pause = !pause;
  }
});

let road = new Image();
road.src = "road.png";
let back = new Image();
back.src = "back.png";
let bird = new Image();
bird.src = "bird.png";
let pipeBottom = new Image();
pipeBottom.src = "pipeBottom.png";
let pipeUp = new Image();
pipeUp.src = "pipeUp.png";

let fly = new Audio();
fly.src = "fly.mp3";
let score = new Audio();
score.src = "score.mp3";

let birdX = 10;
let birdY = 150;
let gravity = 0.5;


let roadX = 0;
function drawRoad() {
  roadX++;
  context.drawImage(road, roadX, 400);
  context.drawImage(road, roadX - 300, 400);
  if (roadX >= 256) {
    roadX = 0;
  }
}

function pipe(x, y) {
  context.drawImage(pipeBottom, x, 300 + y);
  context.drawImage(pipeUp, x, 0 + y);
}

let pipes = [
  { x: 100, y: 0 },
  { x: 225, y: -70 },
  { x: 350, y: -100 },
  { x: 475, y: -30 },
  { x: 600, y: -10 }
];
let clicked = false;

document.addEventListener("click", function () {
  clicked = true;
})
function countScore() {
  scoreCount++;
  scoreText.innerHTML = "Score: " + scoreCount;
  if (clicked) {
    score.play();
  }
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 1;
    pipe(pipes[i].x, pipes[i].y);
    if (pipes[i].x <= -100) {
      pipes[i].x += 590;
      countScore();
    }
  }
}

let scoreCount = 0;

function reloadGame() {
  let previosScore = 0;
  if (localStorage.getItem("bestScore")) {
    previosScore = parseInt(localStorage.getItem("bestScore"));
  }
  if (previosScore > scoreCount) {
    scoreCount = previosScore;
  }
  localStorage.setItem("bestScore", scoreCount);
  bestScore.innerHTML = "Best score: " + scoreCount;
  scoreCount = 0;
  scoreText.innerHTML = "Score: " + scoreCount;
  birdY = 150;
  pipes = [
    { x: 100, y: 0 },
    { x: 225, y: -70 },
    { x: 350, y: -100 },
    { x: 475, y: -30 },
    { x: 600, y: -10 }
  ];
}

function collision(x1, width1, x2, width2,
  y1, height1, y2, height2) {
  let condition1 = x1 + width1 > x2 && x1 + width1 < x2 + width2;
  let condition2 = y1 + height1 > y2 && y1 + height1 < y2 + height2;
  let condition3 = y1 > canvas.height;
  if ((condition1 && condition2) || condition3) {
    //alert("you lose");
    reloadGame();
  }
}

function collisions() {
  for (let i = 0; i < pipes.length; i++) {
    collision(birdX, 30, pipes[i].x, 52, birdY, 25, pipes[i].y, 242);
    collision(birdX, 30, pipes[i].x, 52, birdY, 25, 300 + pipes[i].y, 242);
  }
}

function draw() {
  if (pause) return;
  context.drawImage(back, 0, 0);
  drawPipes();
  drawRoad();
  context.drawImage(bird, birdX, birdY, 30, 25);
  birdX += 0;
  birdY += gravity;
  collisions();
}

setInterval(draw, 10);

function moveUp() {
  birdY -= 4 * gravity;
  fly.play();
}

document.addEventListener("mousemove", function (event) {
  birdY = event.clientY;
});

canvas.addEventListener("mousedown", moveUp);