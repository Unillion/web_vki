const state = {
  lat: 55.7558,
  lon: 37.6173,
  city: 'Москва',
  mode: 'daily',
  offset: 0,
};

const cityNameEl = document.getElementById('cityName');
const cardsEl = document.getElementById('cardsContainer');
const dailyBtn = document.getElementById('dailyBtn');
const hourlyBtn = document.getElementById('hourlyBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,wind_speed_10m_max,weather_code&hourly=temperature_2m,precipitation,wind_speed_10m,weather_code&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  const data = await res.json();

  state.daily = data.daily.time.map((t, i) => ({
    time: t,
    temp: Math.round(data.daily.temperature_2m_max[i]),
    precip: data.daily.precipitation_sum[i] || 0,
    wind: data.daily.wind_speed_10m_max[i] || 0,
    code: data.daily.weather_code[i],
  }));

  state.hourly = data.hourly.time.slice(0, 48).map((t, i) => ({
    time: t,
    temp: Math.round(data.hourly.temperature_2m[i]),
    precip: data.hourly.precipitation[i] || 0,
    wind: data.hourly.wind_speed_10m[i] || 0,
    code: data.hourly.weather_code[i],
  }));
}

function getIcon(code) {
  if (code <= 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌧️';
  if (code <= 69) return '🌨️';
  if (code <= 79) return '❄️';
  if (code <= 84) return '🌦️';
  if (code <= 89) return '🌨️';
  return '⛈️';
}

function formatTime(dateStr, mode) {
  const d = new Date(dateStr);
  if (mode === 'daily') {
    return d.toLocaleDateString('ru', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

function render() {
  const data = state.mode === 'daily' ? state.daily : state.hourly;
  if (!data || !data.length) {
    cardsEl.innerHTML = '<p style="padding:20px">Загрузка...</p>';
    return;
  }

  const perView = 4;
  const maxOffset = Math.max(0, data.length - perView);
  if (state.offset > maxOffset) state.offset = maxOffset;
  const slice = data.slice(state.offset, state.offset + perView);

  cardsEl.innerHTML = slice.map(d => `
    <div class="card">
      <div class="time">${formatTime(d.time, state.mode)}</div>
      <div class="icon">${getIcon(d.code)}</div>
      <div class="temp">${d.temp}°C</div>
      <div class="info">💧${d.precip}mm 🌬${d.wind}м/с</div>
    </div>
  `).join('');
}

function scroll(dir) {
  const data = state.mode === 'daily' ? state.daily : state.hourly;
  const perView = 4;
  const maxOffset = Math.max(0, data.length - perView);
  if (dir === 'next') state.offset = Math.min(state.offset + 1, maxOffset);
  else state.offset = Math.max(state.offset - 1, 0);
  render();
}

function setMode(mode) {
  state.mode = mode;
  state.offset = 0;
  dailyBtn.classList.toggle('active', mode === 'daily');
  hourlyBtn.classList.toggle('active', mode === 'hourly');
  render();
}

async function searchCity(query) {
  const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=ru`;
  const res = await fetch(geoUrl);
  const arr = await res.json();
  if (!arr.length) {
    alert('Город не найден');
    return;
  }
  const { lat, lon } = arr[0];
  state.lat = parseFloat(lat);
  state.lon = parseFloat(lon);
  state.city = arr[0].display_name.split(',')[0];
  cityNameEl.textContent = state.city;
  state.offset = 0;
  await fetchWeather(state.lat, state.lon);
  render();
}

function getLocation() {
  if (!navigator.geolocation) return useMoscow();
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      state.lat = pos.coords.latitude;
      state.lon = pos.coords.longitude;
      try {
        const rev = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${state.lat}&lon=${state.lon}&zoom=10&accept-language=ru`
        );
        const d = await rev.json();
        state.city = d.address?.city || d.address?.town || 'Рядом с вами';
      } catch {
        state.city = 'Ваше место';
      }
      cityNameEl.textContent = state.city;
      await fetchWeather(state.lat, state.lon);
      render();
    },
    () => useMoscow()
  );
}

async function useMoscow() {
  state.lat = 55.7558;
  state.lon = 37.6173;
  state.city = 'Москва';
  cityNameEl.textContent = 'Москва';
  await fetchWeather(state.lat, state.lon);
  render();
}

prevBtn.addEventListener('click', () => scroll('prev'));
nextBtn.addEventListener('click', () => scroll('next'));
dailyBtn.addEventListener('click', () => setMode('daily'));
hourlyBtn.addEventListener('click', () => setMode('hourly'));
searchBtn.addEventListener('click', () => searchCity(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchCity(cityInput.value);
});

getLocation();