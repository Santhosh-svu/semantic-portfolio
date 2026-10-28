# Semantic Portfolio Website

A responsive four-page personal portfolio built with semantic HTML5, mobile-first CSS, CSS Grid, Flexbox, CSS custom properties, and vanilla JavaScript.

## Pages
- `index.html` — Home
- `about.html` — About
- `projects.html` — Projects
- `contact.html` — Accessible contact form demo

## Run locally
Open `index.html` in a browser. No dependencies or build tools are required.

## Accessibility features
- Semantic `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` landmarks
- Skip link to main content
- Descriptive page titles, language declaration, viewport and description metadata
- Navigation labels and `aria-current` for the active page
- Keyboard-visible focus styles
- Responsive navigation with `aria-expanded` and `aria-controls`
- Explicit form labels, native input types, required fields, and live status region
- Reduced-motion preference support
- Mobile-first breakpoints with CSS Grid for page layout and Flexbox for component alignment
- CSS custom properties and a persistent light/dark theme toggle
- Good text contrast and responsive layout

## Before submission
1. Replace sample content with your accurate personal information.
2. Add real project links and professional profile URLs.
3. If your rubric requires the form to send email, connect a backend or approved form service. The current form is a client-side validation demo only.
4. Test all pages using keyboard only and run Lighthouse Accessibility and SEO audits in Chrome DevTools.

## Important
A 100 Lighthouse score cannot be guaranteed without testing in the target environment. Lighthouse scores can vary by browser version and audit conditions. This project is structured to support strong accessibility and SEO results.

## Task 3 — TaskFlow To-Do List

Open `todo.html` to use the interactive to-do application. It supports:
- Create, read, update, and delete tasks
- All, Active, and Completed filters
- Automatic persistence with `localStorage`
- Event delegation for task-row actions
- Responsive layout, keyboard focus styles, live status messages, and light/dark theme toggle

All data stays in the current browser on the device where you use the app. This is a client-side project; it does not sync between devices.

## Task 4 — SkyCast Weather Dashboard

Open `weather.html` in a browser to use the weather dashboard. It uses the Open-Meteo Geocoding API to resolve a city name to coordinates, then calls the Forecast API with `fetch()` and `async/await` to display current temperature, apparent temperature, relative humidity, wind speed, weather code/condition, and local time.

Features:
- City search with loading, empty-result, HTTP, and network error handling
- Parses nested JSON responses from two REST endpoints
- Responsive desktop/mobile layout and accessible status messages
- Weather condition descriptions and icons from WMO weather codes
- No API key required for Open-Meteo's public non-commercial API; attribution is included

Note: use a local server or GitHub Pages if the browser restricts API requests when opening the file directly. Weather availability and precision depend on the upstream forecast model.


## Task 5 — Northstar E-commerce Catalog
See [`shop/README.md`](shop/README.md) for features, local setup and deployment instructions. Open `shop/index.html` through a local server or visit `/shop/` after GitHub Pages deployment.
