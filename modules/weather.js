'use strict';

const axios = require('axios');
const cache = require('./cache.js');

// Rate limiting configuration
const DAILY_LIMIT = 50;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Create an axios instance with optimized configuration
const weatherAPI = axios.create({
  timeout: 5000, // 5 second timeout
  headers: {
    'Accept-Encoding': 'gzip,deflate',
    'Accept': 'application/json',
  },
  // Enable keep-alive for connection pooling
  maxContentLength: 10000000, // 10MB max response size
  validateStatus: status => status >= 200 && status < 300,
  decompress: true // Enable automatic response decompression
});

// Rate limiting state
let requestCount = 0;
let lastReset = new Date().setHours(0, 0, 0, 0);
let pendingRequests = new Map();

// Reset counter at midnight
function resetCounterIfNeeded() {
  const now = new Date();
  const today = now.setHours(0, 0, 0, 0);
  
  if (today > lastReset) {
    requestCount = 0;
    lastReset = today;
  }
}

// Check if we're within rate limits
function checkRateLimit() {
  resetCounterIfNeeded();
  return requestCount < DAILY_LIMIT;
}

// Initialize weather cache if not exists
if (!cache.weather) {
  cache.weather = new Map();
}

// Cancel any existing request for the same coordinates
function cancelPendingRequest(key) {
  if (pendingRequests.has(key)) {
    pendingRequests.get(key).cancel();
    pendingRequests.delete(key);
  }
}

async function getWeather(lat, lon) {
  try {
    // Generate cache key
    const key = `weather-${lat}-${lon}`;
    const now = Date.now();

    // Check cache first
    const cachedData = cache.weather.get(key);
    if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
      return cachedData.data;
    }

    // Check rate limit before making API call
    if (!checkRateLimit()) {
      throw new Error('Daily API request limit reached (50 requests). Please try again tomorrow.');
    }

    // Cancel any pending request for same coordinates
    cancelPendingRequest(key);

    // Create cancel token
    const cancelToken = axios.CancelToken.source();
    pendingRequests.set(key, cancelToken);

    // Increment request counter
    requestCount++;

    // Prepare request config
    const params = new URLSearchParams({
      key: process.env.WEATHER_KEY,
      lang: 'en',
      lat: lat.toString(),
      lon: lon.toString(),
      days: '5',
      units: 'I'
    });

    console.log('Making weather API request with params:', {
      lat: lat.toString(),
      lon: lon.toString(),
      days: '5',
      units: 'I',
      keyLength: process.env.WEATHER_KEY ? process.env.WEATHER_KEY.length : 0
    });

    // Make API call with optimized configuration
    const weatherResponse = await weatherAPI.get('https://api.weatherbit.io/v2.0/forecast/daily', {
      params,
      cancelToken: cancelToken.token
    });
    
    // Remove from pending requests
    pendingRequests.delete(key);
    
    // Parse and cache the response
    const parsedData = await parseWeather(weatherResponse.data);
    cache.weather.set(key, {
      timestamp: now,
      data: parsedData
    });

    return parsedData;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return;
    }
    if (error.response) {
      // Log detailed API error information
      console.error('Weather API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Check for specific error cases
      if (error.response.status === 403) {
        throw new Error('Invalid API key. Please check your WEATHER_KEY environment variable.');
      } else if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`Weather API error: ${error.response.data.error || error.response.statusText}`);
    }
    // Log network or other errors
    console.error('Weather request failed:', error.message);
    throw error;
  }
}

async function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => new Weather(day));
    return weatherSummaries;
  } catch (error) {
    throw new Error(`Error parsing weather data: ${error.message}`);
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