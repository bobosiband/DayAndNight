let cloudEls = [];

/* Create a cloud element tuned to the current cloud cover. */
function createCloud(cloudCover) {
  const cloud = document.createElement('div');
  cloud.className = 'cloud';

  const size = 120 + Math.random() * 200;
  const top = 5 + Math.random() * 35;
  const duration = 60 + Math.random() * 80;
  const delay = -Math.random() * duration;
  const opacity = cloudCover > 70 ? 0.7 + Math.random() * 0.2 : 0.3 + Math.random() * 0.35;

  cloud.style.cssText = `
    width: ${size}px;
    height: ${size * 0.45}px;
    top: ${top}%;
    opacity: ${opacity};
    animation: cloudDrift ${duration}s ${delay}s linear infinite;
    filter: ${cloudCover > 70 ? 'brightness(0.6)' : 'brightness(1)'};
  `;

  return cloud;
}

/* Synchronize the existing clouds with a new cloud-cover value. */
function syncCloudAppearance(cloudCover) {
  for (const cloud of cloudEls) {
    cloud.style.filter = cloudCover > 70 ? 'brightness(0.6)' : 'brightness(1)';
    cloud.style.opacity = cloudCover > 70 ? '0.75' : '0.4';
  }
}

/* Update the cloud layer to match the latest weather state. */
function updateClouds(cloudCover) {
  const container = document.getElementById('cloudContainer');
  if (!container) return;

  syncCloudAppearance(cloudCover);
  const targetCount = Math.round((cloudCover / 100) * 12);

  while (cloudEls.length < targetCount) {
    const cloud = createCloud(cloudCover);
    container.appendChild(cloud);
    cloudEls.push(cloud);
  }

  while (cloudEls.length > targetCount) {
    const cloud = cloudEls.pop();
    cloud.remove();
  }
}

/* Listen for weather updates and keep the cloud layer in sync. */
export function init() {
  document.addEventListener('weatherUpdate', (event) => {
    updateClouds(event.detail.cloudCover);
  });
}
