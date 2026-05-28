const STAR_COUNT = 220;
let stars = [];
let currentAlpha = 0;
let targetAlpha = 0;
let animationFrameId = null;

/* Generate the star field for the current canvas size. */
function generateStars(width, height) {
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.75,
    radius: Math.random() * 1.4 + 0.4,
    twinkleOffset: Math.random() * Math.PI * 2,
  }));
}

/* Draw the star field with a subtle twinkle effect. */
function drawStars(ctx, alpha) {
  const time = Date.now() / 1000;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const star of stars) {
    const twinkle = 0.7 + 0.3 * Math.sin(time * 1.5 + star.twinkleOffset);
    ctx.globalAlpha = alpha * twinkle;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

/* Animate the alpha toward its current target and redraw the stars. */
function animate(ctx) {
  const delta = targetAlpha - currentAlpha;
  currentAlpha = Math.abs(delta) > 0.002 ? currentAlpha + delta * 0.02 : targetAlpha;
  drawStars(ctx, currentAlpha);
  animationFrameId = requestAnimationFrame(() => animate(ctx));
}

/* Resize the canvas to the viewport and regenerate stars. */
function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generateStars(canvas.width, canvas.height);
}

/* Listen for night/day phase changes and manage the star canvas. */
export function init() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  resizeCanvas(canvas);
  window.addEventListener('resize', () => resizeCanvas(canvas));

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animate(ctx);

  document.addEventListener('phaseChange', (event) => {
    targetAlpha = event.detail.isNight ? 1 : 0;
  });
}
