'use strict';

const axios = require('axios');

const celestialBodies = async (lat, lon, date, time) => {
    const url = 'https://astronomy.p.rapidapi.com/api/v2/bodies/positions'
    const options = {
        method: 'GET',
        params: {
          latitude: `${lat}`,
          longitude: `${lon}`,
          from_date: `${date}`,
          to_date: `${date}`,
          elevation: '500',
          time: `${time}:00`
        },
        headers: {
          'X-RapidAPI-Key': `${process.env.RAPID_API}`,
          'X-RapidAPI-Host': 'astronomy.p.rapidapi.com'
        }
      };
      

  const req = await axios.get(url, options)
  // console.log('Log', req.data.data);
  return req.data.data
  
  

}



module.exports = celestialBodies;

