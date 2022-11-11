'use strict'

const axios = require('axios');
const cache = require('../cache.js');

function getLocation(request, response) {
  const searchQuery = request.query;
  const key = 'location-' + request.query;
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&q=${searchQuery}&format=json`;

  if (cache[key] && Date.now() - cache[key].timestamp < 3600000) {
    console.log('getLocation cache hit');
    response.status(200).send(cache[key]);
  } else {
    console.log('getLocation cache miss');
    cache[key] = {};
    axios
      .get(url)
      .then(locationResponse => {
        cache[key].timestamp = Date.now();
        cache[key].date = Date().toLocaleString();
        const searchedLocation = locationResponse.data.slice(0, 1).map(location => new Location(location, cache[key].date));
        cache[key] = searchedLocation;
        response.status(200).send(cache[key]);
      })
      .catch (error => {
        console.error('getLocation() axios error: ', error);
        response.status(500).send('getLocation server error: ', error);
      });
  }
  console.log('location cache is: ', cache);
  return cache[key].data;
}

class Location {
  constructor(location, cacheDate){
    this.locationName = location.display_name;
    this.locationLat = location.lat;
    this.locationLon = location.lon;
  }
}

module.exports = getLocation;
