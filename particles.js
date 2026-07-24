// particles.js

let particles = [];

function spawnParticle(x, y, col, size, life, dx = 0, dy = 0) {
  particles.push({
    x, y,
    dx, dy,
    size,
    life,
    col
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.dx;
    p.y += p.dy;
    p.life -= 1;
    p.size *= 0.95;

    if (p.life <= 0 || p.size < 0.5) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for (let p of particles) {
    x.beginPath();
    x.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    x.fillStyle = p.col;
    x.fill();
  }
}
