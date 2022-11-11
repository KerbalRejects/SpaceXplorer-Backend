'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const app = express();

const verifyUser = require('./modules/auth.js');

app.use(cors());
app.use(express.json());
app.use(verifyUser);
const PORT = process.env.PORT || 3002;
mongoose.connect(process.env.MONGOCONNECTION, {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/test', (request, response) => {

    response.send('test request received')
  
});

app.get('/', Handler.getProfile);
app.post('/', Handler.createProfile);
app.delete('//:id', Handler.deleteProfile);
app.put('//:id', Handler.updateProfile);
app.get('/user', Handler.handleGetUser); 
  
app.listen(PORT, () => console.log(`listening on ${PORT}`));
