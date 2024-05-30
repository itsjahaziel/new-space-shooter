const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const faceSelection = document.getElementById("faceSelection");
const faceOptions = document.querySelectorAll(".face-option");
const startGameButton = document.getElementById("startGame");
const credits = document.getElementById("credits");

canvas.width = 800;
canvas.height = 600;

let selectedFace = null;
const faceImage = new Image();
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0,
};

const bullets = [];
const enemies = [];
const enemyImages = {
  deo: new Image(),
};

enemyImages.deo.src = "s.jpeg"; // Changed the enemy image source to "s.jpeg"

let gameOver = false;

faceOptions.forEach((faceOption) => {
  faceOption.addEventListener("click", () => {
    faceOptions.forEach((option) => option.classList.remove("selected"));
    faceOption.classList.add("selected");
    selectedFace = faceOption.getAttribute("data-face");
  });
});

startGameButton.addEventListener("click", startGame);

function startGame() {
  if (selectedFace) {
    faceImage.src = selectedFace;
    faceImage.onload = () => {
      faceSelection.style.display = "none";
      canvas.style.display = "block";
      credits.style.display = "none";
      resetGame();
      update();
    };
  } else {
    alert("Please select a character!");
  }
}

function resetGame() {
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 60;
  player.dx = 0;
  player.dy = 0;
  bullets.length = 0;
  enemies.length = 0;
  gameOver = false;
}

function drawPlayer() {
  ctx.drawImage(faceImage, player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

function handleKeyDown(e) {
  if (e.key === "ArrowRight" || e.key === "d") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft" || e.key === "a") {
    player.dx = -player.speed;
  } else if (e.key === " ") {
    shoot();
  }
}

function handleKeyUp(e) {
  if (
    e.key === "ArrowRight" ||
    e.key === "d" ||
    e.key === "ArrowLeft" ||
    e.key === "a"
  ) {
    player.dx = 0;
  }
}

function shoot() {
  const bullet = {
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    speed: 7,
  };
  bullets.push(bullet);
}

function drawBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    if (bullet.y + bullet.height < 0) {
      bullets.splice(index, 1);
    }
  });
}

function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 2,
    faceImage: enemyImages.deo,
  });
}

function drawEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;
    ctx.drawImage(enemy.faceImage, enemy.x, enemy.y, enemy.width, enemy.height);
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
      spawnEnemy();
    }
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      gameOver = true;
    }
  });
}

function detectCollision() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        spawnEnemy();
      }
    });
  });
}

function displayGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    "Press Enter to Restart",
    canvas.width / 2,
    canvas.height / 2 + 50
  );
  credits.style.display = "block";
}

function update() {
  if (gameOver) {
    displayGameOver();
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  updatePlayer();
  detectCollision();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
setInterval(spawnEnemy, 2000);

document.body.style.backgroundImage = 'url("background.png")';
document.body.style.backgroundSize = "cover";

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && gameOver) {
    faceSelection.style.display = "block";
    canvas.style.display = "none";
    credits.style.display = "none";
  }
});
