'use strict';

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === 'dark';
  if (themeButton) {
    themeButton.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeButton.setAttribute('aria-pressed', String(!isDark));
  }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (_) {}
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('portfolio-theme', nextTheme); } catch (_) {}
  });
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    navigation.classList.toggle('is-open', !isExpanded);
  });
}

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) {
      formStatus.textContent = 'Please check the required fields and enter a valid email address.';
      return;
    }
    formStatus.textContent = 'Form validation successful. This demo does not send your message.';
  });
}
