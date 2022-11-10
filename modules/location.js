'use strict'

const axios = require('axios');

function getLocation(request, response) {
  const locUrl = `https://us1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${request.query}&format=json`;
  axios
    .get(locUrl)
    .then(locResponse => {
      const locName = locResponse[0].display_name;
      const locLat = locResponse[0].lat;
      const locLon = locResponse[0].lon;
      response.status(200).send('getLocation success ', locResponse[0]);
    })
    .catch (error => {
      console.error('getLocation() axios error: ', error);
      response.status(500).send('getLocation server error: ', error);
    });

}

module.exports = getLocation;
