// ui.js

// =========================
// DRAW HUD
// =========================
function drawHUD() {
  x.fillStyle = "white";
  x.font = "16px Arial";

  x.fillText(`HP: ${p.hp.toFixed(0)}/${p.maxHp}`, 10, 20);
  x.fillText(`Mana: ${p.mana.toFixed(0)}/${p.maxMana}`, 10, 40);
  x.fillText(`Money: ${money}`, 10, 60);
  x.fillText(`Difficulty: ${difficulty.toFixed(2)}`, 10, 80);
  x.fillText(`Class: ${currentClass}`, 10, 100);
}

// =========================
// DRAW SUMMONS
// =========================
function drawSummons() {
  for (let s of sums) {
    x.save();
    x.translate(s.x, s.y);
    x.rotate(s.rot);
    x.fillStyle = s.col;
    x.beginPath();
    x.arc(0, 0, s.r, 0, Math.PI * 2);
    x.fill();
    x.restore();
  }
}

// =========================
// DRAW PLAYER + TURRET SHOTS
// =========================
function drawShots() {
  for (let s of shots) {
    x.beginPath();
    x.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    x.fillStyle = s.col;
    x.fill();
  }
}

// =========================
// DRAW BOSS SHOTS
// =========================
function drawBossShots() {
  for (let b of bShots) {
    x.beginPath();
    x.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    x.fillStyle = b.col;
    x.fill();
  }
}

// =========================
// DRAW ENEMIES + HP BARS
// =========================
function drawEnemies() {
  for (let e of enemies) {
    // Enemy body
    x.beginPath();
    x.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    x.fillStyle = e.col;
    x.fill();

    // HP bar
    const maxHp = e.type === "summoner" ? 60 * difficulty : 20 * difficulty;
    const hpPercent = Math.max(0, e.hp / maxHp);

    x.fillStyle = "black";
    x.fillRect(e.x - e.r, e.y - e.r - 10, e.r * 2, 6);

    x.fillStyle = "lime";
    x.fillRect(e.x - e.r, e.y - e.r - 10, (e.r * 2) * hpPercent, 6);
  }
}

// =========================
// DRAW BOSS
// =========================
function drawBoss() {
  if (!boss) return;

  x.beginPath();
  x.arc(boss.x, boss.y, boss.r, 0, Math.PI * 2);
  x.fillStyle = "red";
  x.fill();
}

// =========================
// DRAW PAUSE MENU (CLASS SHOP)
// =========================
function drawPauseMenu() {
  x.fillStyle = "rgba(0,0,0,0.7)";
  x.fillRect(0, 0, c.width, c.height);

  x.fillStyle = "white";
  x.font = "28px Arial";
  x.fillText("Class Shop", 50, 60);

  const classes = ["circle", "square", "triangle", "pentagram", "octagon", "hexagon"];
  const w = 180, h = 60, g = 10;
  const sx = 50, sy = 100;

  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i];
    const xBox = sx;
    const yBox = sy + i * (h + g);

    // Colored box
    x.fillStyle = classColors[cls];
    x.fillRect(xBox, yBox, w, h);

    // Text
    x.fillStyle = "black";
    x.font = "14px Arial";
    x.fillText(cls, xBox + 10, yBox + 25);
    x.fillText(`Cost: ${classPrices[cls]}`, xBox + 10, yBox + 45);
  }
}

// =========================
// SHOP CLICK HANDLER
// =========================
function handleShopClick(mx, my) {
  const classes = ["circle", "square", "triangle", "pentagram", "octagon", "hexagon"];
  const w = 180, h = 60, g = 10;
  const sx = 50, sy = 100;

  for (let i = 0; i < classes.length; i++) {
    const xBox = sx;
    const yBox = sy + i * (h + g);

    if (mx >= xBox && mx <= xBox + w &&
        my >= yBox && my <= yBox + h) {
      buyClass(classes[i]);
      return;
    }
  }
}

// =========================
// DRAW DEATH SCREEN
// =========================
function drawDeathScreen() {
  x.fillStyle = "rgba(0,0,0,0.7)";
  x.fillRect(0, 0, c.width, c.height);

  x.fillStyle = "white";
  x.font = "40px Arial";
  x.textAlign = "center";
  x.fillText("You Died", c.width / 2, c.height / 2 - 20);

  x.font = "20px Arial";
  x.fillText("Click to Respawn", c.width / 2, c.height / 2 + 20);

  x.textAlign = "left";
