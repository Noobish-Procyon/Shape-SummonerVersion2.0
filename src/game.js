import { Player } from './player.js';
import { Summon } from './entities.js';
import { WaveManager } from './waves.js';
import { loadSave, saveProgress } from './save.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();

    this.saveData = loadSave();
    this.player = new Player(this.width / 2, this.height / 2, this.saveData);
    this.enemies = [];
    this.summons = [];
    this.waveManager = new WaveManager();

    this.lastTime = performance.now();

    this.setupUI();
    this.spawnInitialSummons();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setupUI() {
    const classNameEl = document.getElementById('class-name');
    const levelEl = document.getElementById('level');
    const xpEl = document.getElementById('xp');
    const hpEl = document.getElementById('hp');
    const classSelect = document.getElementById('class-select');

    const classes = ['Summoner', 'Gunner', 'Tank'];
    classes.forEach(cls => {
      const btn = document.createElement('button');
      btn.textContent = cls;
      btn.onclick = () => {
        this.player.setClass(cls, this.saveData);
        this.updateUI();
      };
      classSelect.appendChild(btn);
    });

    this.ui = { classNameEl, levelEl, xpEl, hpEl };
    this.updateUI();
  }

  updateUI() {
    const { classNameEl, levelEl, xpEl, hpEl } = this.ui;
    classNameEl.textContent = `Class: ${this.player.className}`;
    levelEl.textContent = `Level: ${this.player.level}`;
    xpEl.textContent = `XP: ${this.player.xp}/${this.player.xpToNext}`;
    hpEl.textContent = `HP: ${Math.round(this.player.hp)}/${this.player.maxHp}`;
  }

  spawnInitialSummons() {
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const r = 60;
      this.summons.push(new Summon(
        this.player.x + Math.cos(angle) * r,
        this.player.y + Math.sin(angle) * r
      ));
    }
  }

  update(dt) {
    this.player.update(dt);
    this.waveManager.update(dt, this.enemies);

    this.enemies.forEach(e => e.update(dt, this.player));
    this.summons.forEach(s => s.update(dt, this.enemies));

    // cleanup & XP
    this.enemies = this.enemies.filter(e => {
      if (e.dead) {
        this.player.gainXp(5, this.saveData);
        return false;
      }
      return true;
    });

    this.updateUI();
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.player.draw(ctx);
    this.enemies.forEach(e => e.draw(ctx));
    this.summons.forEach(s => s.draw(ctx));
  }

  loop = () => {
    const now = performance.now();
    const dt = (now - this.lastTime) / 16.67; // ~60fps normalized
    this.lastTime = now;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop);
  };
}
