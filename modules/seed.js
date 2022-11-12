'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () { console.log('It worked! Mongoose is connected') });

const Profile = require('../models/profile');

async function seed() {
    console.log('Seeding database...');

    await Profile.create({
        user: 'Ethan Luxton',
        email: 'luxtonethan@gmail.com',
        isFavorited: true,
        favorites: {
            location: 'Seattle, Washington',
            date: '11/10/2022',
            astroData: {
                astroMap: 'dummyUrl',
                lat: '912214',
                lon: '123123'
            },
            weather: {
                desc: 'aohuisdfaosdh testing',
                lowTemp: '70f',
                highTemp: '76f'
            },
            comment: 'pls work'
        }
    });

    mongoose.disconnect()
}

seed()

async function clear() {
    try {
       await Book.deleteMany({});
       console.log('Books cleared');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

// clear();