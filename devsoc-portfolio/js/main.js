import { start as startClock, setTimezone } from './clock.js';
import { init as initSky } from './sky.js';
import { init as initCelestial } from './celestial.js';
import { init as initStars } from './stars.js';
import { init as initWeather } from './weather.js';
import { init as initClouds } from './clouds.js';
import { init as initRain } from './rain.js';
import { populateTimezoneSelect } from './timezones.js';

const WEATHER_DISPLAY = {
  clear: { icon: '☀️', label: 'Clear' },
  cloudy: { icon: '☁️', label: 'Cloudy' },
  fog: { icon: '🌫️', label: 'Foggy' },
  rain: { icon: '🌧️', label: 'Rainy' },
  snow: { icon: '❄️', label: 'Snowy' },
  storm: { icon: '⛈️', label: 'Storm' },
};

/* Update the weather badge when new conditions arrive. */
function updateWeatherBadge(condition) {
  const display = WEATHER_DISPLAY[condition] || WEATHER_DISPLAY.clear;
  const iconEl = document.getElementById('weatherIcon');
  const labelEl = document.getElementById('weatherLabel');
  if (iconEl) iconEl.textContent = display.icon;
  if (labelEl) labelEl.textContent = display.label;
}

/* Wire the homepage once the document is ready. */
function boot() {
  initSky();
  initCelestial();
  initStars();
  initClouds();
  initRain();

  const tzSelect = document.getElementById('tzSelect');
  const clockTimeEl = document.getElementById('clockTime');
  const clockDateEl = document.getElementById('clockDate');
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  populateTimezoneSelect(tzSelect, defaultTimezone);
  tzSelect?.addEventListener('change', () => setTimezone(tzSelect.value));

  startClock(({ timeStr, dateStr }) => {
    if (clockTimeEl) clockTimeEl.textContent = timeStr;
    if (clockDateEl) clockDateEl.textContent = dateStr;
  });

  updateWeatherBadge('clear');
  document.addEventListener('weatherUpdate', (event) => {
    updateWeatherBadge(event.detail.condition);
  });

  initWeather();
}

document.addEventListener('DOMContentLoaded', boot);
