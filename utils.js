const c = document.getElementById("game");
const x = c.getContext("2d");

function resizeCanvas() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
}
resizeCanvas();
onresize = resizeCanvas;

function border(o) {
  if (o.x - o.r < 0) o.x = o.r;
  if (o.x + o.r > c.width) o.x = c.width - o.r;
  if (o.y - o.r < 0) o.y = o.r;
  if (o.y + o.r > c.height) o.y = c.height - o.r;
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

let shake = 0;

function applyShake() {
  if (shake > 0) {
    x.save();
    x.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    shake *= 0.9;
  }
}

function endShake() {
  if (shake > 0) x.restore();
}
