'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const mongoose  = require('mongoose');
const app = express();
const getLocation = require('./modules/location');

// const verifyUser = require('./auth.js');

app.use(cors());
app.use(express.json());
// app.use(verifyUser);
const PORT = process.env.PORT || 3002;
// mongoose.connect(process.env.MONGOCONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/test', (request, response) => {

    response.send('test request received')
  
});

// route for getting user submitted location
app.get('/location', getLocation);
  
app.listen(PORT, () => console.log(`listening on ${PORT}`));
