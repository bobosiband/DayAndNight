const TIMEZONE_GROUPS = {
  Pacific: ['Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu', 'Pacific/Samoa'],
  Australia: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane', 'Australia/Perth', 'Australia/Adelaide', 'Australia/Darwin'],
  Asia: ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Bangkok', 'Asia/Jakarta'],
  Europe: ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Moscow', 'Europe/Istanbul'],
  Africa: ['Africa/Johannesburg', 'Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi'],
  Americas: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Vancouver', 'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Mexico_City'],
  UTC: ['UTC'],
};

/* Format a timezone offset label such as UTC+11:00. */
export function getUTCOffset(timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const offsetPart = formatter.formatToParts(new Date()).find((part) => part.type === 'timeZoneName');
    return offsetPart ? offsetPart.value : '';
  } catch {
    return '';
  }
}

/* Populate the timezone select element with grouped options. */
export function populateTimezoneSelect(selectEl, defaultTimezone) {
  if (!selectEl) return;
  selectEl.innerHTML = '';

  for (const [region, timezoneList] of Object.entries(TIMEZONE_GROUPS)) {
    const group = document.createElement('optgroup');
    group.label = region;

    for (const timezone of timezoneList) {
      const option = document.createElement('option');
      const offset = getUTCOffset(timezone);
      const label = timezone.split('/').pop().replace(/_/g, ' ');
      option.value = timezone;
      option.textContent = `${label} (${offset})`;
      if (timezone === defaultTimezone) option.selected = true;
      group.appendChild(option);
    }

    selectEl.appendChild(group);
  }
}

export { TIMEZONE_GROUPS };
