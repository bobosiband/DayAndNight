import { start as startClock } from './clock.js';
import { init as initSky } from './sky.js';
import { init as initCelestial } from './celestial.js';
import { init as initStars } from './stars.js';
import { init as initWeather } from './weather.js';
import { init as initClouds } from './clouds.js';
import { init as initRain } from './rain.js';

/*
 * Profile page entry point.
 *
 * Owner: Bongani Sibanda
 * Degree: Software Engineering @ UNSW
 * Born: 14 May 2006
 * Uni start: 2025
 * Interests: Basketball - LA Lakers fan (LeBron James era)
 */

const BIRTH_DATE = new Date('2006-05-14');
const UNI_START_YEAR = 2025;

/* Calculate age in whole years from a birth date. */
function calcAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

/* Calculate the current university year label. */
function calcUniYear(startYear) {
  const yearsIn = new Date().getFullYear() - startYear + 1;
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const suffix = yearsIn <= 3 ? suffixes[yearsIn] : 'th';
  return `${yearsIn}${suffix}`;
}

const COURSES = [
  { code: 'COMP1511', name: 'Programming Fundamentals' },
  { code: 'COMP1521', name: 'Computer Systems Fundamentals' },
  { code: 'COMP1531', name: 'Software Eng. Fundamentals' },
  { code: 'COMP2521', name: 'Data Structures & Algorithms' },
  { code: 'COMP2041', name: 'Software Construction' },
  { code: 'SENG2021', name: 'Software Eng. Workshop I' },
  { code: 'MATH1131', name: 'Mathematics 1A' },
  { code: 'MATH1081', name: 'Discrete Mathematics' },
  { code: 'MATH1231', name: 'Mathematics 1B' },
  { code: 'DESN1000', name: 'Engineering Design' },
];

const PROJECTS = [
  {
    name: 'KinEvents',
    description: 'Event management platform for communities and families.',
    url: 'https://kinevents.vercel.app',
    tech: ['React', 'Node.js', 'Vercel', 'MongoDB'],
  },
  {
    name: 'FamLog',
    description: 'Family activity and memory logging application.',
    url: 'https://famlogs.vercel.app',
    tech: ['React', 'Node.js', 'MongoDB', 'Vercel'],
  },
  {
    name: 'CampusPulse',
    description: 'Campus events and club discovery platform for UNSW students.',
    url: null,
    tech: ['React', 'Superbase', 'Vercel'],
  },
  {
    name: 'GooseAPI',
    description: 'SENG2021 Goose Patrol — RESTful API project.',
    url: 'https://seng-2021-goose-patrol.vercel.app',
    tech: ['Node.js', 'Express', 'REST', 'Vercel', 'Aws Lambda', 'DynamoDB'],
  },
  {
    name: 'Monday Night Sports',
    description: 'Manages college sports at UNSW',
    url: null,
    tech: ['in progress but should be done before T3 starts'],
  },
];

/* Write the live bio and tagline values into the profile page. */
function renderBio() {
  const bioEl = document.getElementById('aboutBio');
  const uniYearEl = document.getElementById('uniYearLabel');
  const uniStartEl = document.getElementById('uniStartLabel');

  const age = calcAge(BIRTH_DATE);
  const uniYear = calcUniYear(UNI_START_YEAR);

  if (uniYearEl) uniYearEl.textContent = uniYear;
  if (uniStartEl) uniStartEl.textContent = UNI_START_YEAR;

  if (bioEl) {
    bioEl.textContent =
      `Hey, I'm Bongani - a ${uniYear}-year Software Engineering student at UNSW ` +
      `(started ${UNI_START_YEAR}), currently ${age} years old and loving every bit ` +
      `of the degree so far. I'm passionate about building things that actually work ` +
      `and look great doing it.`;
  }
}

/* Render the course cards into the profile grid. */
function renderCourses() {
  const grid = document.getElementById('courseGrid');
  if (!grid) return;

  COURSES.forEach((course, index) => {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.animationDelay = `${index * 0.07}s`;
    card.innerHTML = `<span class="course-code">${course.code}</span><span class="course-name">${course.name}</span>`;
    grid.appendChild(card);
  });
}

/* Render the project cards and their tech badges. */
function renderProjects() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  PROJECTS.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.12}s`;

    const techBadges = project.tech.map((tech) => `<span class="tech-badge">${tech}</span>`).join('');
    const linkHTML = project.url
      ? `<a href="${project.url}" target="_blank" rel="noopener" class="project-link">View →</a>`
      : '<span class="project-link disabled">Coming Soon</span>';

    card.innerHTML = `
      <h3 class="project-name">${project.name}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="tech-list">${techBadges}</div>
      ${linkHTML}
    `;

    grid.appendChild(card);
  });
}

/*
 * WAM modal state machine.
 * The modal moves through three states: idle, verifying, and reveal.
 * CSS handles the fade/slide transitions between state panels, while JS
 * controls focus, the timed verification sequence, and the typewriter reveal.
 */
function initWAM() {
  const revealMessages = [
    "You really thought I'd leak my WAM?",
    "My WAM is between 0 and 100. That's all you're getting.",
  ];

  const verificationSteps = [
    { message: 'Reviewing application…', delay: 1200 },
    { message: 'Assessing potential…', delay: 900 },
    { message: 'Consulting academic authorities…', delay: 1800 },
    { message: 'Cross-referencing UNSW records…', delay: 1000 },
    { message: 'Verifying basketball knowledge…', delay: 1400 },
    { message: 'Deliberating…', delay: 2000 },
    { message: 'Admission decision: ACCEPTED', delay: 800, final: true },
  ];

  const stateHeadings = {
    idle: 'Access Request',
    verifying: 'Verification in Progress',
    reveal: 'Application Accepted',
  };

  const stateAnnouncements = {
    idle: 'Access Request ready.',
    verifying: 'Verification sequence started.',
    reveal: 'Application accepted.',
  };

  const modal = document.getElementById('wamModal');
  const openButton = document.getElementById('wamOpenButton');
  const primaryAction = document.getElementById('wamPrimaryAction');
  const heading = document.getElementById('wamModalHeading');
  const liveRegion = document.getElementById('wamModalLive');
  const stepList = document.getElementById('wamStepList');
  const revealMessage = document.getElementById('wamRevealMessage');
  const closeControls = modal ? modal.querySelectorAll('[data-wam-close]') : [];
  const focusableSelector = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  if (!modal || !openButton || !primaryAction || !heading || !liveRegion || !stepList || !revealMessage) {
    return;
  }

  let state = 'idle';
  let closeTimerId = null;
  let typewriterTimerId = null;
  let activeTimers = [];
  let lastFocusedElement = null;
  let revealText = revealMessages[Math.floor(Math.random() * revealMessages.length)];

  /* Build the verification list once, then reset classes between runs. */
  stepList.innerHTML = verificationSteps
    .map((step, index) => {
      const stepClass = step.final ? 'wam-step-item wam-step-item--final' : 'wam-step-item';
      return `
        <li class="${stepClass}" data-step-index="${index}">
          <span class="wam-step-icon" aria-hidden="true"></span>
          <span class="wam-step-text">${step.message}</span>
        </li>
      `;
    })
    .join('');

  const stepItems = Array.from(stepList.querySelectorAll('.wam-step-item'));

  /* Clear all outstanding timers so a closed modal cannot keep advancing. */
  function clearTimers() {
    activeTimers.forEach((timerId) => window.clearTimeout(timerId));
    activeTimers = [];
  }

  /* Stop the reveal typewriter so the next open starts cleanly. */
  function stopTypewriter() {
    if (typewriterTimerId) {
      window.clearInterval(typewriterTimerId);
      typewriterTimerId = null;
    }
    revealMessage.classList.remove('is-typing');
  }

  /* Announce modal state changes to assistive tech. */
  function announce(message) {
    liveRegion.textContent = message;
  }

  /* Keep the panel heading and footer button aligned with the active state. */
  function syncControls(nextState) {
    heading.textContent = stateHeadings[nextState];

    if (nextState === 'idle') {
      primaryAction.textContent = 'Accept Me Into the Training Program';
      primaryAction.className = 'wam-button wam-button--primary wam-button--cta';
      primaryAction.disabled = false;
      closeControls.forEach((control) => {
        if (control instanceof HTMLButtonElement) {
          control.disabled = false;
        }
      });
      return;
    }

    if (nextState === 'verifying') {
      primaryAction.textContent = 'Verifying…';
      primaryAction.className = 'wam-button wam-button--secondary';
      primaryAction.disabled = true;
      closeControls.forEach((control) => {
        if (control instanceof HTMLButtonElement) {
          control.disabled = true;
        }
      });
      return;
    }

    primaryAction.textContent = 'Close';
    primaryAction.className = 'wam-button wam-button--secondary';
    primaryAction.disabled = false;
    closeControls.forEach((control) => {
      if (control instanceof HTMLButtonElement) {
        control.disabled = false;
      }
    });
  }

  /* Reset the step list so the verification flow always starts from the top. */
  function resetVerificationSteps() {
    stepItems.forEach((item) => {
      item.classList.remove('is-visible', 'is-done');
      const icon = item.querySelector('.wam-step-icon');
      if (icon) {
        icon.classList.remove('is-spinning', 'is-done');
        icon.textContent = '';
      }
    });
  }

  /* Switch the modal state and keep the live region in sync. */
  function setState(nextState) {
    state = nextState;
    modal.classList.remove('is-idle', 'is-verifying', 'is-reveal');
    modal.classList.add(`is-${nextState}`);
    syncControls(nextState);
    announce(stateAnnouncements[nextState]);
  }

  /* Type the sarcastic reveal message character by character. */
  function startTypewriter(text) {
    stopTypewriter();
    revealMessage.textContent = '';
    revealMessage.classList.add('is-typing');

    let index = 0;
    typewriterTimerId = window.setInterval(() => {
      revealMessage.textContent += text[index];
      index += 1;

      if (index >= text.length) {
        stopTypewriter();
      }
    }, 28);
  }

  /* Move from the verification flow into the final punchline screen. */
  function enterRevealState() {
    clearTimers();
    setState('reveal');
    startTypewriter(revealText);
  }

  /* Drive the timed verification steps with realistic pauses. */
  function runVerificationSequence() {
    clearTimers();
    resetVerificationSteps();

    let elapsed = 0;

    verificationSteps.forEach((step, index) => {
      const item = stepItems[index];
      if (!item) return;

      const startTimerId = window.setTimeout(() => {
        const icon = item.querySelector('.wam-step-icon');
        item.classList.add('is-visible');
        if (icon) {
          icon.classList.add('is-spinning');
          icon.textContent = '';
        }
        announce(step.message);

        const finishTimerId = window.setTimeout(() => {
          item.classList.add('is-done');
          item.classList.remove('is-visible');
          if (icon) {
            icon.classList.remove('is-spinning');
            icon.classList.add('is-done');
            icon.textContent = '✓';
          }

          if (step.final) {
            const revealTimerId = window.setTimeout(() => {
              enterRevealState();
            }, 800);
            activeTimers.push(revealTimerId);
          }
        }, step.delay);

        activeTimers.push(finishTimerId);
      }, elapsed);

      activeTimers.push(startTimerId);
      elapsed += step.delay;
    });
  }

  /* Open the modal in its idle state. */
  function openModal() {
    if (modal.classList.contains('is-open')) return;

    if (closeTimerId) {
      window.clearTimeout(closeTimerId);
      closeTimerId = null;
    }

    clearTimers();
    stopTypewriter();
    revealText = revealMessages[Math.floor(Math.random() * revealMessages.length)];
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : openButton;

    modal.classList.remove('is-closing');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setState('idle');
    resetVerificationSteps();
    revealMessage.textContent = '';

    window.setTimeout(() => {
      primaryAction.focus();
    }, 0);
  }

  /* Close the modal unless the verification flow is still running. */
  function closeModal() {
    if (!modal.classList.contains('is-open') || state === 'verifying') return;

    clearTimers();
    stopTypewriter();
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && modal.contains(activeElement)) {
      activeElement.blur();
    }
    modal.classList.remove('is-open');
    modal.classList.add('is-closing');
    modal.setAttribute('aria-hidden', 'true');

    closeTimerId = window.setTimeout(() => {
      modal.classList.remove('is-closing', 'is-idle', 'is-verifying', 'is-reveal');
      setState('idle');
      resetVerificationSteps();
      revealMessage.textContent = '';
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }, 220);
  }

  /* Trap focus inside the modal while it is visible. */
  function trapFocus(event) {
    const focusableElements = Array.from(modal.querySelectorAll(focusableSelector)).filter((element) => {
      return element instanceof HTMLElement && !element.hasAttribute('disabled') && element.offsetParent !== null;
    });

    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  openButton.addEventListener('click', openModal);

  primaryAction.addEventListener('click', () => {
    if (state === 'idle') {
      setState('verifying');
      runVerificationSequence();
      return;
    }

    if (state === 'reveal') {
      closeModal();
    }
  });

  modal.addEventListener('click', (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target || state === 'verifying' || !target.closest('[data-wam-close]')) return;
    closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      if (state !== 'verifying') {
        event.preventDefault();
        closeModal();
      }
      return;
    }

    if (event.key === 'Tab') {
      trapFocus(event);
    }
  });

  setState('idle');
}

/* Boot the shared sky and populate the profile content. */
function boot() {
  initSky();
  initCelestial();
  initStars();
  initClouds();
  initRain();
  initWeather();
  startClock(() => {});
  renderCourses();
  renderProjects();
  renderBio();
  initWAM();
}

document.addEventListener('DOMContentLoaded', boot);
