'use strict';


const axios = require('axios');


function celestialBodies (lat, lon, date) {

const options = {
    method: 'POST',
    url: 'https://astronomy.p.rapidapi.com/api/v2/studio/star-chart',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': `${process.env.RAPID_API}`,
      'X-RapidAPI-Host': 'astronomy.p.rapidapi.com'
    },
    data: `{"observer":{"date":${date},"latitude":${lat} ,"longitude":${lon},"style":"inverted","view":{"type": "area", "parameters":{"position": {"equatorial":{"rightAscension" : 15.00, "declination": 15.00}}, "zoom":3}}`
  };
  
  axios.request(options).then(function (response) {
      console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });
}

module.exports = poststars;