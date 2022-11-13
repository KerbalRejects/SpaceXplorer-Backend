'use strict';
// const hash = btoa(`${process.env.APPID}:${process.env.HASH}`)

const axios = require('axios');


const postStars = async (lat, lon, date) => {
const options = {
    method: 'POST',
    url: 'https://astronomy.p.rapidapi.com/api/v2/studio/star-chart',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': `${process.env.RAPID_API}`,
      'X-RapidAPI-Host': 'astronomy.p.rapidapi.com'
    },
    data: `{"style": "default","observer": {"latitude": ${lat},"longitude": ${lon},"date": "${date}"},"view": {"type": "constellation","parameters": {"constellation": "ori"}}}`
    //data: `{"observer": {"latitude": ${lat},"longitude": ${lon},"date": ${date}},"view": {"type": "area","parameters": {"position": {"equatorial": {"rightAscension": 14.83,"declination": -15.23}},"zoom": 3}}}`
  };
  
  // axios.request(options).then(function (response) {
  //     console.log(response.data);
  // }).catch(function (error) {
  //     console.error(error);
  // });




  


  // const req = await axios.post(url, options)
  // console.log('Log two: ', req);
  // return req

  const req = await axios.request(options)
  return req
  
}

module.exports = postStars;