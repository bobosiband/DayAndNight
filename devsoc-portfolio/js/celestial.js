const SUN_START_HOUR = 6;
const SUN_END_HOUR = 20;
const MOON_START_HOUR = 20;
const MOON_END_HOUR = 30;

/* Calculate the sun position for the current time. */
export function getSunPosition(hour, minute) {
  const totalMinutes = hour * 60 + minute;
  const startMinutes = SUN_START_HOUR * 60;
  const endMinutes = SUN_END_HOUR * 60;

  if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
    return { visible: false, x: 0, arcY: 0 };
  }

  const progress = (totalMinutes - startMinutes) / (endMinutes - startMinutes);
  return {
    visible: true,
    x: progress * 88 + 6,
    arcY: Math.sin(progress * Math.PI) * 70,
  };
}

/* Calculate the moon position for the current time. */
export function getMoonPosition(hour, minute) {
  const normalizedHour = hour < 6 ? hour + 24 : hour;
  const totalMinutes = normalizedHour * 60 + minute;
  const startMinutes = MOON_START_HOUR * 60;
  const endMinutes = MOON_END_HOUR * 60;

  if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
    return { visible: false, x: 0, arcY: 0 };
  }

  const progress = (totalMinutes - startMinutes) / (endMinutes - startMinutes);
  return {
    visible: true,
    x: progress * 88 + 6,
    arcY: Math.sin(progress * Math.PI) * 60,
  };
}

/* Apply a celestial position to an element. */
function applyPosition(element, position) {
  if (!element) return;
  if (!position.visible) {
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    return;
  }

  element.style.opacity = '1';
  element.style.pointerEvents = 'none';
  element.style.left = `${position.x}%`;
  element.style.bottom = `${position.arcY}vh`;
  element.style.transform = 'translateX(-50%)';
}

/* Listen for clock ticks and move the sun and moon accordingly. */
export function init() {
  const sunEl = document.getElementById('sunBody');
  const moonEl = document.getElementById('moonBody');

  document.addEventListener('clockTick', (event) => {
    const { hourNum, minuteNum } = event.detail;
    applyPosition(sunEl, getSunPosition(hourNum, minuteNum));
    applyPosition(moonEl, getMoonPosition(hourNum, minuteNum));
  });
}
