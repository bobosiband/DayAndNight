import { start as startClock } from './clock.js';
import { init as initSky } from './sky.js';
import { init as initCelestial } from './celestial.js';
import { init as initStars } from './stars.js';
import { init as initWeather } from './weather.js';
import { init as initClouds } from './clouds.js';
import { init as initRain } from './rain.js';

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
    tech: ['React', 'Node.js', 'Vercel'],
  },
  {
    name: 'FamLog',
    description: 'Family activity and memory logging application.',
    url: 'https://famlogs.vercel.app',
    tech: ['React', 'Firebase'],
  },
  {
    name: 'CampusPulse',
    description: 'Campus events and club discovery platform for UNSW students.',
    url: null,
    tech: ['React', 'REST API'],
  },
  {
    name: 'GooseAPI',
    description: 'SENG2021 Goose Patrol — RESTful API project.',
    url: 'https://seng-2021-goose-patrol.vercel.app',
    tech: ['Node.js', 'Express', 'REST'],
  },
];

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
}

document.addEventListener('DOMContentLoaded', boot);
