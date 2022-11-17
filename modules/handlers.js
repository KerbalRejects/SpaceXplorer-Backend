'use strict';

// import schema model
const Profiles = require('../models/profile');

const Handler = {};

Handler.getProfile = async (request, response, next) => {
    try {
        const profiles = await Profiles.find({ email: request.user.email });
        response.status(200).send(profiles);
    } catch (error) {
        error.customMessage = 'Something went wrong when getting your profile';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.createFavorite = async (request, response, next) => {
    console.log('Request: ',request, 'Request.body: ',request.body)
    try {
        const favorite = await Profiles.create({ ...request.body});
        response.status(201).send(favorite);
    } catch (error) {
        error.customMessage = 'Something went wrong when creating your profile';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.deleteFavorite = async (request, response, next) => {
    try {
        await Profiles.findByIdAndDelete( request.params.id );
        response.status(200).send('Your favorite is deleted!');
    } catch (error) {
        error.customMessage = 'Something went wrong when deleting your favorite: ';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.updateFavorites = async (req, res, next) => {
    console.log(req.body);
    console.log(req.params);
    try {
        const updatedFavorite = await Profiles.findByIdAndUpdate(req.params.id, { "favorites.comment": req.body }, { new: true });
        console.log(updatedFavorite);
        res.status(200).send(updatedFavorite);
    } catch(err) {
        err.customMessage = 'Something went wrong when updating your favorite: ';
        console.error(err.customMessage + err);
        next(err);
    }
}

Handler.handleGetUser = (req, res) => {
    console.log('Getting the user');
    res.send(req.user);
};

module.exports = Handler;