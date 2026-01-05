
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");

const keys = {};
let gameRunning = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let p1, p2, bullets;

function startGame() {
  p1 = {
    x: 100, y: 300, w: 40, h: 40,
    color: "blue", hp: 100, dir: 1
  };
  p2 = {
    x: 660, y: 300, w: 40, h: 40,
    color: "red", hp: 100, dir: -1
  };
  bullets = [];
  gameRunning = true;
}

function endGame() {
  gameRunning = false;
}

startBtn.addEventListener("click", startGame);
endBtn.addEventListener("click", endGame);

function shoot(player) {
  bullets.push({
    x: player.x + player.w / 2,
    y: player.y + player.h / 2,
    speed: 6 * player.dir,
    owner: player
  });
}

function drawPlayer(p) {
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, p.w, p.h);
}

function drawHP(p, x, y) {
  ctx.fillStyle = "black";
  ctx.fillRect(x, y, 104, 14);
  ctx.fillStyle = "lime";
  ctx.fillRect(x + 2, y + 2, p.hp, 10);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameRunning) {
    // Player 1 movement & shoot
    if (keys["a"]) p1.x -= 5;
    if (keys["d"]) p1.x += 5;
    if (keys["w"]) {
      if (!p1.shooting) {
        shoot(p1);
        p1.shooting = true;
      }
    } else p1.shooting = false;

    // Player 2 movement & shoot
    if (keys["ArrowLeft"]) p2.x -= 5;
    if (keys["ArrowRight"]) p2.x += 5;
    if (keys["ArrowUp"]) {
      if (!p2.shooting) {
        shoot(p2);
        p2.shooting = true;
      }
    } else p2.shooting = false;

    // Update bullets
    bullets.forEach(b => b.x += b.speed);

    bullets = bullets.filter(b => {
      const target = b.owner === p1 ? p2 : p1;
      if (
        b.x > target.x &&
        b.x < target.x + target.w &&
        b.y > target.y &&
        b.y < target.y + target.h
      ) {
        target.hp -= 5;
        return false;
      }
      return b.x > 0 && b.x < canvas.width;
    });

    // Check winner
    if (p1.hp <= 0 || p2.hp <= 0) {
      gameRunning = false;
    }
  }

  // Draw
  if (p1 && p2) {
    drawPlayer(p1);
    drawPlayer(p2);

    bullets.forEach(b => {
      ctx.fillStyle = "black";
      ctx.fillRect(b.x, b.y, 6, 2);
    });

    drawHP(p1, 20, 20);
    drawHP(p2, 680, 20);

    if (!gameRunning && (p1.hp <= 0 || p2.hp <= 0)) {
      ctx.font = "36px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(
        p1.hp <= 0 ? "Player 2 ชนะ!" : "Player 1 ชนะ!",
        250, 200
      );
    }
  }

  requestAnimationFrame(update);
}

update();
