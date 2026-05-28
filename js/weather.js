const DEFAULT_LAT = -33.8688;
const DEFAULT_LNG = 151.2093;
const REFRESH_INTERVAL = 10 * 60 * 1000;

let weatherState = {
  condition: 'clear',
  cloudCover: 0,
  precipitation: 0,
  windSpeed: 0,
  isDay: true,
};

/* Convert a WMO weather code to the simplified sky state. */
function wmoToCondition(code) {
  if (code === 0) return 'clear';
  if (code <= 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 95 && code <= 99) return 'storm';
  return 'clear';
}

/* Fetch the latest weather state for the supplied coordinates. */
async function fetchWeather(latitude, longitude) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', 'weathercode,cloudcover,precipitation,windspeed_10m,is_day');
  url.searchParams.set('timezone', 'auto');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

    const data = await response.json();
    const current = data.current || {};
    weatherState = {
      condition: wmoToCondition(current.weathercode),
      cloudCover: current.cloudcover ?? 0,
      precipitation: current.precipitation ?? 0,
      windSpeed: current.windspeed_10m ?? 0,
      isDay: current.is_day === 1,
    };

    document.dispatchEvent(new CustomEvent('weatherUpdate', { detail: weatherState }));
  } catch (error) {
    console.warn('Weather fetch failed, keeping the last known state.', error);
  }
}

/* Resolve the user's location, falling back to Sydney if needed. */
function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => resolve({ lat: DEFAULT_LAT, lng: DEFAULT_LNG }),
      { timeout: 5000 },
    );
  });
}

/* Start the weather refresh loop and emit the first weather update. */
export async function init() {
  const { lat, lng } = await getUserLocation();
  await fetchWeather(lat, lng);
  setInterval(() => fetchWeather(lat, lng), REFRESH_INTERVAL);
}

export { weatherState };
