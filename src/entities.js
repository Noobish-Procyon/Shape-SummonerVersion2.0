export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 1.4;
    this.hp = 20;
    this.dead = false;
  }

  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const len = Math.hypot(dx, dy) || 1;
    this.x += (dx / len) * this.speed * dt;
    this.y += (dy / len) * this.speed * dt;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.rect(-8, -8, 16, 16);
    ctx.fill();
    ctx.restore();
  }
}

export class Summon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 80;
    this.cooldown = 0;
    this.rate = 1.5;
  }

  update(dt, enemies) {
    this.cooldown -= dt;
    if (this.cooldown <= 0) {
      const target = enemies.find(e => !e.dead && Math.hypot(e.x - this.x, e.y - this.y) < this.range);
      if (target) {
        target.hp -= 10;
        if (target.hp <= 0) target.dead = true;
        this.cooldown = this.rate;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = '#66ccff';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
