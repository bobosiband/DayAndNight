const PHASE_MAP = {
  midnight: ['--sky-midnight-top', '--sky-midnight-bot'],
  predawn: ['--sky-predawn-top', '--sky-predawn-bot'],
  dawn: ['--sky-dawn-top', '--sky-dawn-bot'],
  sunrise: ['--sky-sunrise-top', '--sky-sunrise-bot'],
  morning: ['--sky-morning-top', '--sky-morning-bot'],
  noon: ['--sky-noon-top', '--sky-noon-bot'],
  afternoon: ['--sky-afternoon-top', '--sky-afternoon-bot'],
  golden: ['--sky-golden-top', '--sky-golden-bot'],
  sunset: ['--sky-sunset-top', '--sky-sunset-bot'],
  dusk: ['--sky-dusk-top', '--sky-dusk-bot'],
  twilight: ['--sky-twilight-top', '--sky-twilight-bot'],
  night: ['--sky-night-top', '--sky-night-bot'],
};

const NIGHT_PHASES = new Set(['midnight', 'predawn', 'dawn', 'dusk', 'twilight', 'night']);
let currentPhase = null;

/* Map an hour to a sky phase. */
export function getPhase(hour) {
  if (hour < 4) return 'midnight';
  if (hour < 5) return 'predawn';
  if (hour < 6) return 'dawn';
  if (hour < 7) return 'sunrise';
  if (hour < 10) return 'morning';
  if (hour < 14) return 'noon';
  if (hour < 17) return 'afternoon';
  if (hour < 18) return 'golden';
  // Night should start at 18:00 (6 PM) — anything from 18:00 onwards is night.
  return 'night';
}

/* Read a CSS custom property from the root element. */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* Apply the active sky phase to the page and dispatch a phase event. */
function applyPhase(phase) {
  if (!phase || phase === currentPhase) return;
  currentPhase = phase;

  const [topVar, bottomVar] = PHASE_MAP[phase];
  const skyEl = document.getElementById('skyBackground');
  if (skyEl) {
    const topColor = getCSSVar(topVar);
    const bottomColor = getCSSVar(bottomVar);
    skyEl.style.background = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;
  }

  const isNight = NIGHT_PHASES.has(phase);
  document.body.dataset.phase = phase;
  document.body.dataset.night = String(isNight);
  document.dispatchEvent(new CustomEvent('phaseChange', { detail: { phase, isNight } }));
}

/* Wire the sky engine to the clock tick stream. */
export function init() {
  document.addEventListener('clockTick', (event) => {
    applyPhase(getPhase(event.detail.hourNum));
  });
}

export { NIGHT_PHASES };
