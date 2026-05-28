const DROP_COUNT = 120;
let activeMode = 'none';
let dropEls = [];

/* Create a single rain drop for the current storm mode. */
function createDrop(isStorm) {
  const drop = document.createElement('div');
  drop.className = isStorm ? 'raindrop storm-drop' : 'raindrop';

  const left = Math.random() * 110 - 5;
  const duration = isStorm ? 0.4 + Math.random() * 0.3 : 0.7 + Math.random() * 0.5;
  const delay = -Math.random() * duration;
  const height = isStorm ? 22 : 16;

  drop.style.cssText = `
    left: ${left}%;
    height: ${height}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
  `;

  return drop;
}

/* Remove every active rain drop from the page. */
function stopRain() {
  for (const drop of dropEls) drop.remove();
  dropEls = [];
  activeMode = 'none';
}

/* Populate the rain layer with drops for rain or storm conditions. */
function startRain(isStorm) {
  const mode = isStorm ? 'storm' : 'rain';
  const container = document.getElementById('rainContainer');
  if (!container) return;

  if (activeMode === mode) return;
  stopRain();

  for (let index = 0; index < DROP_COUNT; index += 1) {
    const drop = createDrop(isStorm);
    container.appendChild(drop);
    dropEls.push(drop);
  }

  activeMode = mode;
}

/* Toggle the storm and fog overlays with the current weather state. */
function syncOverlays(condition) {
  const stormOverlay = document.getElementById('stormOverlay');
  const fogOverlay = document.getElementById('fogOverlay');

  if (stormOverlay) stormOverlay.style.opacity = condition === 'storm' ? '1' : '0';
  if (fogOverlay) fogOverlay.style.opacity = condition === 'fog' ? '1' : '0';
}

/* Listen for weather changes and update rain, storm, and fog layers. */
export function init() {
  document.addEventListener('weatherUpdate', (event) => {
    const { condition } = event.detail;
    if (condition === 'rain' || condition === 'storm') {
      startRain(condition === 'storm');
    } else {
      stopRain();
    }

    syncOverlays(condition);
  });
}
