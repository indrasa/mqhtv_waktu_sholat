const express = require('express');
const app = express();
const PORT = 3000;

const API_URL = 'https://api.aladhan.com/v1/timingsByCity/19-07-2026?city=Mataram&country=Indonesia&method=11';

let timings = {};

const fetchTimings = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    timings = data.data.timings;
    console.log('Timings fetched:', timings);
  } catch (err) {
    console.error('Failed to fetch timings:', err.message);
  }
};

const map = {
  subuh: 'Fajr',
  dzuhur: 'Dhuhr',
  ashar: 'Asr',
  maghrib: 'Maghrib',
  isya: 'Isha',
};

Object.entries(map).forEach(([endpoint, key]) => {
  app.get(`/${endpoint}`, (req, res) => {
    res.send(timings[key]);
  });
});

app.listen(PORT, () => {
  fetchTimings();
  console.log(`Server running on http://localhost:${PORT}`);
});
