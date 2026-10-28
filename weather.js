(() => {
  'use strict';

  const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
  const form = document.querySelector('#search-form');
  const cityInput = document.querySelector('#city-input');
  const searchButton = document.querySelector('#search-button');
  const statusMessage = document.querySelector('#status-message');
  const weatherContent = document.querySelector('#weather-content');
  const errorCard = document.querySelector('#error-card');
  const errorTitle = document.querySelector('#error-title');
  const errorDetail = document.querySelector('#error-detail');
  const retryButton = document.querySelector('#retry-button');
  let lastCity = 'Chennai';
  let requestId = 0;

  const weatherDescriptions = {
    0: ['Clear sky', '☀'], 1: ['Mainly clear', '🌤'], 2: ['Partly cloudy', '⛅'],
    3: ['Overcast', '☁'], 45: ['Foggy', '🌫'], 48: ['Depositing rime fog', '🌫'],
    51: ['Light drizzle', '🌦'], 53: ['Moderate drizzle', '🌦'], 55: ['Dense drizzle', '🌧'],
    56: ['Light freezing drizzle', '🌧'], 57: ['Dense freezing drizzle', '🌧'],
    61: ['Slight rain', '🌦'], 63: ['Moderate rain', '🌧'], 65: ['Heavy rain', '🌧'],
    66: ['Light freezing rain', '🌧'], 67: ['Heavy freezing rain', '🌧'],
    71: ['Slight snowfall', '🌨'], 73: ['Moderate snowfall', '🌨'], 75: ['Heavy snowfall', '❄'],
    77: ['Snow grains', '❄'], 80: ['Slight rain showers', '🌦'], 81: ['Moderate rain showers', '🌧'],
    82: ['Violent rain showers', '⛈'], 85: ['Slight snow showers', '🌨'], 86: ['Heavy snow showers', '🌨'],
    95: ['Thunderstorm', '⛈'], 96: ['Thunderstorm with hail', '⛈'], 99: ['Thunderstorm with heavy hail', '⛈']
  };

  function setStatus(text, isError = false) {
    statusMessage.textContent = text;
    statusMessage.classList.toggle('error', isError);
  }

  function setLoading(isLoading) {
    searchButton.disabled = isLoading;
    searchButton.textContent = isLoading ? 'Loading…' : 'Search ↗';
    cityInput.setAttribute('aria-busy', String(isLoading));
  }

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      if (response.status === 429) throw new Error('The weather service is receiving too many requests. Please wait a moment and try again.');
      throw new Error(`Weather service returned an error (${response.status}). Please try again.`);
    }
    return response.json();
  }

  async function getCoordinates(city) {
    const url = new URL(GEOCODING_URL);
    url.search = new URLSearchParams({ name: city, count: '8', language: 'en', format: 'json' });
    const data = await fetchJson(url);
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error(`We couldn't find “${city}”. Check the spelling or try a nearby city.`);
    }
    // Prefer the first geocoding match; the returned country/admin region disambiguates the location.
    return data.results[0];
  }

  async function getCurrentWeather(location) {
    const url = new URL(FORECAST_URL);
    url.search = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
      timezone: 'auto',
      temperature_unit: 'celsius',
      wind_speed_unit: 'kmh'
    });
    return fetchJson(url);
  }

  function formatLocalTime(time, timezone) {
    if (!time) return timezone || 'Local time unavailable';
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return timezone || 'Local time unavailable';
    return `${date.toLocaleString('en', { weekday: 'long', hour: 'numeric', minute: '2-digit', hour12: true })}${timezone ? ` · ${timezone.replaceAll('_', ' ')}` : ''}`;
  }

  function displayWeather(location, data) {
    const current = data.current;
    if (!current || typeof current.temperature_2m !== 'number') {
      throw new Error('The weather service returned incomplete data for this location. Please try another city.');
    }
    const description = weatherDescriptions[current.weather_code] || ['Weather conditions unavailable', '🌡'];
    const city = location.name || 'Selected city';
    const region = location.admin1 ? `, ${location.admin1}` : '';
    const country = location.country ? `, ${location.country}` : '';

    document.querySelector('#city-name').textContent = `${city}${region}${country}`;
    document.querySelector('#local-time').textContent = formatLocalTime(current.time, data.timezone);
    document.querySelector('#condition').textContent = description[0];
    document.querySelector('#weather-symbol').textContent = description[1];
    document.querySelector('#temperature').textContent = `${Math.round(current.temperature_2m)}°`;
    document.querySelector('#temperature-label').textContent = `°C · ${current.is_day ? 'Daytime' : 'Nighttime'}`;
    document.querySelector('#feels-value').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.querySelector('#humidity').innerHTML = `${Math.round(current.relative_humidity_2m)}<span>%</span>`;
    document.querySelector('#wind').innerHTML = `${Number(current.wind_speed_10m).toFixed(1)}<span> km/h</span>`;
    document.querySelector('#feels-metric').innerHTML = `${Math.round(current.apparent_temperature)}<span>°C</span>`;
    document.querySelector('#coordinates').textContent = `${Number(location.latitude).toFixed(2)}°, ${Number(location.longitude).toFixed(2)}°`;
    document.querySelector('#humidity-bar').style.width = `${Math.max(0, Math.min(100, current.relative_humidity_2m))}%`;

    const apparent = current.apparent_temperature;
    document.querySelector('#comfort-note').textContent = apparent >= 35 ? 'Feels very hot' : apparent >= 27 ? 'Feels warm' : apparent <= 10 ? 'Feels chilly' : 'Comfortable range';
    weatherContent.hidden = false;
    errorCard.hidden = true;
    setStatus(`Showing current conditions for ${city}.`);
  }

  async function searchWeather(city) {
    const query = city.trim();
    if (!query) {
      setStatus('Enter a city name to search.', true);
      cityInput.focus();
      return;
    }

    const thisRequest = ++requestId;
    lastCity = query;
    setLoading(true);
    errorCard.hidden = true;
    setStatus(`Searching for ${query}…`);

    try {
      const location = await getCoordinates(query);
      const data = await getCurrentWeather(location);
      // Ignore stale results if the user submitted a newer search while this one was loading.
      if (thisRequest !== requestId) return;
      displayWeather(location, data);
    } catch (error) {
      if (thisRequest !== requestId) return;
      weatherContent.hidden = true;
      errorCard.hidden = false;
      errorTitle.textContent = 'Couldn’t load weather';
      errorDetail.textContent = error instanceof TypeError
        ? 'A network error occurred. Check your internet connection and make sure you are online.'
        : (error.message || 'Something went wrong. Please try again.');
      setStatus('Weather request failed.', true);
    } finally {
      if (thisRequest === requestId) setLoading(false);
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    searchWeather(cityInput.value);
  });

  retryButton.addEventListener('click', () => {
    cityInput.value = lastCity;
    searchWeather(lastCity);
  });

  cityInput.value = lastCity;
  searchWeather(lastCity);
})();
