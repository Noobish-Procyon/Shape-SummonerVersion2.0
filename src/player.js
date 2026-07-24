import { keys } from './input.js';
import { saveProgress } from './save.js';

const CLASS_DEFS = {
  Summoner: {
    maxHp: 100,
    moveSpeed: 2.8,
    summonRate: 2.0,
  },
  Gunner: {
    maxHp: 80,
    moveSpeed: 3.2,
    summonRate: 0.8,
  },
  Tank: {
    maxHp: 150,
    moveSpeed: 2.2,
    summonRate: 1.2,
  },
};

export class Player {
  constructor(x, y, saveData) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.className = saveData.className || 'Summoner';
    this.level = saveData.level;
    this.xp = saveData.xp;
    this.xpToNext = saveData.xpToNext;

    this.applyClassStats();
    this.hp = this.maxHp;
  }

  applyClassStats() {
    const def = CLASS_DEFS[this.className];
    this.maxHp = def.maxHp + (this.level - 1) * 10;
    this.moveSpeed = def.moveSpeed + (this.level - 1) * 0.1;
    this.summonRate = def.summonRate;
  }

  setClass(className, saveData) {
    this.className = className;
    saveData.className = className;
    saveProgress(saveData);
    this.applyClassStats();
    this.hp = this.maxHp;
  }

  gainXp(amount, saveData) {
    this.xp += amount;
    saveData.xp = this.xp;

    if (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level++;
      saveData.level = this.level;
      this.xpToNext = Math.floor(this.xpToNext * 1.3);
      saveData.xpToNext = this.xpToNext;
      this.applyClassStats();
    }

    saveProgress(saveData);
  }

  update(dt) {
    let ax = 0;
    let ay = 0;
    if (keys.left) ax -= 1;
    if (keys.right) ax += 1;
    if (keys.up) ay -= 1;
    if (keys.down) ay += 1;

    const len = Math.hypot(ax, ay) || 1;
    ax /= len;
    ay /= len;

    this.vx += ax * this.moveSpeed;
    this.vy += ay * this.moveSpeed;

    // tighter movement
    this.vx *= 0.85;
    this.vy *= 0.85;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
