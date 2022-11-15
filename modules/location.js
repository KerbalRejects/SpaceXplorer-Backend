'use strict'

const axios = require('axios');
const cache = require('../cache.js');
const celestialBodies = require('./bodiesapi.js')
const postStars = require('./poststars.js')
const getWeather = require('./weather')
function getLocation(request, response) {
  
  console.log('request.query: ', request.query);
  console.log('request.query.location: ', request.query.location);
  console.log('request.query.date: ', request.query.date);
  console.log('request.query.time: ', request.query.time);
  const {location, date, time} = request.query;
  console.log('location: ', location);
  console.log('date: ', date);
  console.log('time: ', time);
  const key = 'location-' + location;
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_KEY}&q=${location}&format=json`;

  if (cache[key] && Date.now() - cache[key].timestamp < 3600000) {
    console.log('getLocation cache hit');
    console.log('cache hit date/time: ', Date().toLocaleString());
    response.status(200).send(cache[key]);
  } else {
    console.log('getLocation cache miss');
    console.log('cache miss date/time: ', Date().toLocaleString());
    cache[key] = {};
    axios
      .get(url)
      .then(locationResponse => {
        
        cache[key].timestamp = Date.now();
        cache[key].date = Date().toLocaleString();
        const searchedLocation = locationResponse.data.slice(0, 1).map(location => new Location(location, cache[key].date));
        console.log('searchedLocation: ', searchedLocation);
        cache[key] = searchedLocation;
        
        celestialBodies(searchedLocation[0].locationLat, searchedLocation[0].locationLon, date, time).then(res => {
          postStars(searchedLocation[0].locationLat, searchedLocation[0].locationLon, date).then(starMap => {
            getWeather(searchedLocation[0].locationLat, searchedLocation[0].locationLon).then(weatherData => {
              console.log('Bodies Response: ', res, 'Starmap Response: ', starMap.data, 'Weather data: ', weatherData)
              response.status(200).send([cache[key], res, starMap.data.data, weatherData]);     
            })   
          })    
        }); 
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

// class starBodiesObj {
//   constructor(input) {
//     this.observer = input.observer;
//     this.dates = input.dates;
//     this.table = input.table;
//   }
// }

module.exports = getLocation;
