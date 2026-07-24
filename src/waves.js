import { Enemy } from './entities.js';

export class WaveManager {
  constructor() {
    this.time = 0;
    this.spawnTimer = 0;
    this.wave = 1;
  }

  update(dt, enemies) {
    this.time += dt;
    this.spawnTimer -= dt;

    const spawnInterval = Math.max(0.6, 2.0 - this.wave * 0.1);

    if (this.spawnTimer <= 0) {
      this.spawnTimer = spawnInterval;
      const angle = Math.random() * Math.PI * 2;
      const radius = 300;
      const x = Math.cos(angle) * radius + 400;
      const y = Math.sin(angle) * radius + 300;
      enemies.push(new Enemy(x, y));
    }

    if (this.time > 30) {
      this.wave++;
      this.time = 0;
    }
  }
}
