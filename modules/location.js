'use strict'

const axios = require('axios');
const cache = require('../cache.js');

function getLocation(request, response) {
  console.log(request.query.location);
  const location = request.query.location;
  const key = 'location-' + location;
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&q=${location}&format=json`;

  if (cache[key] && Date.now() - cache[key].timestamp < 3600000) {
    console.log('getLocation cache hit');
    console.log('cache hit date/time: ', Date().toLocaleString());
    response.status(200).send(cache[key]);
  } else{
    console.log('getLocation cache miss');
    console.log('cache miss date/time: ', Date().toLocaleString());
    cache[key] = {};
    axios
      .get(url)
      .then(locationResponse => {
        cache[key].timestamp = Date.now();
        cache[key].date = Date().toLocaleString();
        console.log(locationResponse.data.slice(0,1));
        const searchedLocation = locationResponse.data.slice(0, 1).map(location => new Location(location, cache[key].date));
        console.log('searchedLocation: ', searchedLocation);
        cache[key] = searchedLocation;
        response.status(200).send(cache[key]);
      })
      .catch (error => {
        console.error('getLocation axios error: ', error);
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
    this.cacheDate = cacheDate;
  }
}

module.exports = getLocation;
