const express = require('express');
const app = express();
const PORT = 3000;

const API_URL = 'https://api.aladhan.com/v1/timingsByCity/19-07-2026?city=Mataram&country=Indonesia&method=11';

let timings = {};
let lastFetch = 0;
const TTL = 3600000;

async function getTimings() {
  const now = Date.now();
  if (Object.keys(timings).length && now - lastFetch < TTL) return timings;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    timings = data.data.timings;
    lastFetch = now;
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
  return timings;
}

const map = {
  subuh: 'Fajr',
  dzuhur: 'Dhuhr',
  ashar: 'Asr',
  maghrib: 'Maghrib',
  isya: 'Isha',
};

Object.entries(map).forEach(([endpoint, key]) => {
  app.get(`/${endpoint}`, async (req, res) => {
    await getTimings();
    res.send(timings[key] || '');
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    getTimings();
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
