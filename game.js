const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===============================
// ESTADOS DO JOGO
// ===============================
let gameState = "menu"; // menu | playing | gameover
let score = 0;

// ===============================
// PLAYER NO MEIO DA TELA
// ===============================
const player = {
  width: 40,
  height: 40,
  speed: 5,
  x: canvas.width / 2 - 20,
  y: canvas.height / 2 - 20
};

// ===============================
// BLOCOS INIMIGOS
// ===============================
let enemies = [];

// ===============================
// FUNÇÃO PARA CRIAR BLOCO
// ===============================
function spawnEnemy() {
  const size = 40;
  let x, y;
  let side = Math.floor(Math.random() * 4);

  if (side === 0) { // cima
    x = Math.random() * canvas.width;
    y = -size;
  }
  if (side === 1) { // baixo
    x = Math.random() * canvas.width;
    y = canvas.height;
  }
  if (side === 2) { // esquerda
    x = -size;
    y = Math.random() * canvas.height;
  }
  if (side === 3) { // direita
    x = canvas.width;
    y = Math.random() * canvas.height;
  }

  enemies.push({ x, y, width: size, height: size, speed: 2 });
}

// ===============================
// CONTROLES
// ===============================
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ===============================
// BOTÃO (CLIQUE DO MOUSE)
// ===============================
canvas.addEventListener("click", (e) => {

  if (gameState === "menu") {
    gameState = "playing";
  }

  if (gameState === "gameover") {
    restartGame();
  }
});

// ===============================
// UPDATE
// ===============================
function update() {

  // Movimento do player
  if (keys["ArrowUp"] && player.y > 0)
    player.y -= player.speed;

  if (keys["ArrowDown"] && player.y + player.height < canvas.height)
    player.y += player.speed;

  if (keys["ArrowLeft"] && player.x > 0)
    player.x -= player.speed;

  if (keys["ArrowRight"] && player.x + player.width < canvas.width)
    player.x += player.speed;

  // Spawn inimigos
  if (Math.random() < 0.02) {
    spawnEnemy();
  }

  // Movimento dos blocos
  enemies.forEach(enemy => {

    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let angle = Math.atan2(dy, dx);

    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;

    // Colisão
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameState = "gameover";
    }
  });

  score++;
}

// ===============================
// DESENHO
// ===============================
function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "menu") {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("MEU JOGO 2D", 260, 200);

    ctx.font = "30px Arial";
    ctx.fillText("▶ PLAY", 340, 300);
    return;
  }

  if (gameState === "playing") {

    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  if (gameState === "gameover") {

    ctx.fillStyle = "yellow";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", 260, 200);

    ctx.font = "30px Arial";
    ctx.fillText("🔁 REINICIAR", 300, 300);
  }
}

// ===============================
// REINICIAR
// ===============================
function restartGame() {
  enemies = [];
  score = 0;
  player.x = canvas.width / 2 - 20;
  player.y = canvas.height / 2 - 20;
  gameState = "playing";
}

// ===============================
// GAME LOOP
// ===============================
function gameLoop() {

  if (gameState === "playing") {
    update();
  }

  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();