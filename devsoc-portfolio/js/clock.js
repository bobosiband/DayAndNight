let currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let intervalId = null;

/* Format the current time and date for a given timezone. */
export function formatTime(date, timezone) {
  const timeOptions = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  const dateOptions = { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const hourOptions = { timeZone: timezone, hour: 'numeric', hour12: false };
  const minuteOptions = { timeZone: timezone, minute: 'numeric' };

  const timeStr = new Intl.DateTimeFormat('en-AU', timeOptions).format(date);
  const dateStr = new Intl.DateTimeFormat('en-AU', dateOptions).format(date);
  const hourNum = Number(new Intl.DateTimeFormat('en-AU', hourOptions).format(date));
  const minuteNum = Number(new Intl.DateTimeFormat('en-AU', minuteOptions).format(date));

  return { timeStr, dateStr, hourNum, minuteNum };
}

/* Update the active timezone used by the clock. */
export function setTimezone(timezone) {
  currentTimezone = timezone;
}

/* Start the clock tick loop and broadcast each formatted tick. */
export function start(renderFn) {
  if (intervalId) clearInterval(intervalId);

  const tick = () => {
    const formatted = formatTime(new Date(), currentTimezone);
    renderFn(formatted);
    document.dispatchEvent(new CustomEvent('clockTick', { detail: formatted }));
  };

  tick();
  intervalId = setInterval(tick, 1000);
}
