/* Clamp a value between a minimum and maximum. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* Linearly interpolate between two values. */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* Convert degrees to radians. */
export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

/* Wrap a function with a debounce delay. */
export function debounce(fn, delay) {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}
