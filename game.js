// game.js

function update() {
  if (paused) return;

  difficulty += 0.0005;

  updatePlayer();
  updateTurrets();
  updateTurretShots();
  updateEnemies();
  updateBoss();
  updateBossShots();
  updateParticles();

  if (abilityCooldown > 0) abilityCooldown--;

  localStorage.setItem("cgMoney", money);
  localStorage.setItem("cgDiff", difficulty);
}

function draw() {
  x.clearRect(0, 0, c.width, c.height);

  x.strokeStyle = "white";
  x.lineWidth = 3;
  x.strokeRect(0, 0, c.width, c.height);

  x.beginPath();
  x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  x.fillStyle = "white";
  x.fill();

  applyShake();

  drawHUD();
  drawSummons();
  drawShots();
  drawBossShots();
  drawEnemies();
  drawBoss();
  drawParticles();

  endShake();

  if (paused) drawPauseMenu();
  if (dead) drawDeathScreen();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

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
  particles = [];
}
