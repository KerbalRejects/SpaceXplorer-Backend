'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema ({
    email: String,
    isFavorited: Boolean,
    favorites: {
        location: String,
        date: String,
        astroData: {
                astroMap: String,
                lat: String, 
                lon: String,
                },
        weather: {
                desc: String, 
                lowTemp: String, 
                highTemp: String
                },
        comment: String
    }
});

const Profiles = mongoose.model('Profile', profileSchema);

module.exports = Profiles;