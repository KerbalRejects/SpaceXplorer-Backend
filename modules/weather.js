'use strict';

const axios = require('axios');
const cache = require('./cache.js');

function getWeather(lat, lon) {
  const key = 'weather-' + lat + lon;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5&units=I`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(url)
      .then(weatherResponse => parseWeather(weatherResponse.data));
  }
  console.log('cache is ', cache);
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(Object.assign({}, weatherSummaries));
  } catch (error) {
    return Promise.reject(error);
  }
}

class Weather {
  constructor(day) {
    this.description = day.weather.description;
    this.icon = day.weather.icon;
    this.date = day.datetime;
    this.min_temp = day.min_temp;
    this.high_temp = day.high_temp;
    this.sunrise = day.sunrise_ts;
    this.sunset = day.sunset_ts;
  }
}

module.exports = getWeather;