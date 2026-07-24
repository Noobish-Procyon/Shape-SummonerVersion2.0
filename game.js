// game.js

// =========================
// MAIN UPDATE
// =========================
function update() {
  if (paused) return;

  // Difficulty slowly increases
  difficulty += 0.0005;

  // Player
  updatePlayer();

  // Turrets
  updateTurrets();
  updateTurretShots();

  // Enemies
  updateEnemies();

  // Boss
  updateBoss();
  updateBossShots();

  // Save progress
  localStorage.setItem("cgMoney", money);
  localStorage.setItem("cgDiff", difficulty);
}

// =========================
// MAIN DRAW
// =========================
function draw() {
  x.clearRect(0, 0, c.width, c.height);

  // Border
  x.strokeStyle = "white";
  x.lineWidth = 3;
  x.strokeRect(0, 0, c.width, c.height);

  // Player
  x.beginPath();
  x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  x.fillStyle = "white";
  x.fill();

  // HUD
  drawHUD();

  // Summons
  drawSummons();

  // Shots
  drawShots();

  // Boss shots
  drawBossShots();

  // Enemies
  drawEnemies();

  // Boss
  drawBoss();

  // Pause menu
  if (paused) {
    drawPauseMenu();
  }

  // Death screen
  if (dead) {
    drawDeathScreen();
  }
}

// =========================
// GAME LOOP
// =========================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// =========================
// RESPAWN
// =========================
function respawn() {
  dead = false;

  p.x = c.width / 2;
  p.y = c.height / 2;

  p.hp = p.maxHp;
  p.mana = p.maxMana;

  boss = null;
  enemies = [];
  sums = [];
  shots = [];
  bShots = [];
}
