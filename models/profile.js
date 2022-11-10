'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema ({
    user: String,
    email: String,
    isFavorited: Boolean,
    favorites: {
        object: {map: String, 
                lat: String, 
                lon: String},
        location: String,
        date: String,
        comment: String
    }
});

const Profiles = mongoose.model('Profile', profileSchema);

module.exports = Profiles;