'use strict'

const axios = require('axios');
const cache = require('../cache.js');
const celestialBodies = require('./bodiesapi.js')
const postStars = require('./poststars.js')
const getWeather = require('./weather')

// Create optimized axios instance for location API
const locationAPI = axios.create({
  baseURL: 'https://us1.locationiq.com/v1',
  timeout: 5000,
  headers: {
    'Accept-Encoding': 'gzip,deflate',
    'Accept': 'application/json'
  },
  validateStatus: status => status >= 200 && status < 300
});

// Cache duration (1 hour)
const CACHE_DURATION = 3600000;

async function getLocation(request, response) {
  try {
    const { location, date, time } = request.query;

    if (!location) {
      return response.status(400).send({ error: 'Location is required' });
    }

    // Log request parameters
    console.log('Request parameters:', { location, date, time });

    const key = `location-${location}`;
    const now = Date.now();

    // Check cache
    if (cache[key] && (now - cache[key].timestamp < CACHE_DURATION)) {
      console.log('Cache hit for location:', location);
      return response.status(200).send(cache[key].data);
    }

    console.log('Cache miss for location:', location);

    // Prepare location API request
    const params = new URLSearchParams({
      key: process.env.LOCATIONIQ_KEY,
      q: location,
      format: 'json'
    });

    // Get location data
    const locationResponse = await locationAPI.get('/search', { params });
    const searchedLocation = locationResponse.data
      .slice(0, 1)
      .map(loc => new Location(loc, new Date().toLocaleString()))[0];

    if (!searchedLocation) {
      return response.status(404).send({ error: 'Location not found' });
    }

    // Parallel API requests for better performance
    try {
      const [celestialData, starMapData, weatherData] = await Promise.all([
        celestialBodies(
          searchedLocation.locationLat,
          searchedLocation.locationLon,
          date,
          time
        ),
        postStars(
          searchedLocation.locationLat,
          searchedLocation.locationLon,
          date
        ),
        getWeather(
          searchedLocation.locationLat,
          searchedLocation.locationLon
        )
      ]);

      // Prepare response data
      const responseData = [
        searchedLocation,
        celestialData,
        starMapData.data.data,
        weatherData
      ];

      // Update cache
      cache[key] = {
        timestamp: now,
        data: responseData
      };

      return response.status(200).send(responseData);
    } catch (error) {
      // Handle errors from parallel requests
      console.error('API request error:', error);
      return response.status(500).send({
        error: 'Error fetching astronomical data',
        details: error.message
      });
    }
  } catch (error) {
    console.error('Location service error:', error);
    
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        return response.status(429).send({ error: 'Rate limit exceeded. Please try again later.' });
      }
      if (status === 401) {
        return response.status(401).send({ error: 'Invalid API key' });
      }
    }

    return response.status(500).send({
      error: 'Internal server error',
      details: error.message
    });
  }
}

class Location {
  constructor(location, cacheDate) {
    this.locationName = location.display_name;
    this.locationLat = location.lat;
    this.locationLon = location.lon;
    this.cacheDate = cacheDate;
  }
}

// class starBodiesObj {
//   constructor(input) {
//     this.observer = input.observer;
//     this.dates = input.dates;
//     this.table = input.table;
//   }
// }

module.exports = getLocation;
