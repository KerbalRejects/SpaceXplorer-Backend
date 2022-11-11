'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const app = express();
const getWeather = require('./modules/weather');
const verifyUser = require('./auth.js');

app.use(cors());
app.use(express.json());
app.use(verifyUser);
const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGOCONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/test', (request, response) => {

    response.send('test request received')
  
});
  
app.listen(PORT, () => console.log(`listening on ${PORT}`));

app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
    const { lat, lon } = request.query;
    getWeather(lat, lon)
      .then(summaries => response.send(summaries))
      .catch((error) => {
        console.error(error);
        response.status(500).send(error.message);
      });
  }