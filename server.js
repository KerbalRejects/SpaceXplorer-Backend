'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const app = express();
const getLocation = require('./modules/location');

const getWeather = require('./modules/weather');
const verifyUser = require('./auth.js');

const Handler = require('./modules/handlers');
app.use(cors());
app.use(express.json());
app.get('/location', getLocation);
app.use(verifyUser);
const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGOCONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/test', (request, response) => {
    
    response.send('test request received')
    
});


// route for getting user submitted location


app.get('/profile', Handler.getProfile);
app.post('/favorites', Handler.createFavorite);
app.delete('/profile/:id', Handler.deleteFavorite);
app.put('/profile/:id', Handler.updateFavorites);
// app.get('/user', Handler.handleGetUser); 
app.get('/', (req, res) => {
    res.send('Ping')
})
  
if (!process.env.WEATHER_KEY) {
  console.error('WARNING: WEATHER_KEY environment variable is not set');
} else {
  console.log('WEATHER_KEY is configured (length:', process.env.WEATHER_KEY.length, ')');
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));

// app.get('/weather', weatherHandler);

// function weatherHandler(request, response) {
//     const { lat, lon } = request.query;
//     getWeather(lat, lon)
//       .then(summaries => response.send(summaries))
//       .catch((error) => {
//         console.error(error);
//         response.status(500).send(error.message);
//       });
//   }