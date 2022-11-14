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
        const favorite = await Profiles.create({ ...request.body, email: request.user.email });
        response.status(201).send(favorite);
    } catch (error) {
        error.customMessage = 'Something went wrong when creating your profile';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.deleteFavorite = async (request, response, next) => {
    try {
        await Profiles.findByIdAndDelete({ ...request.params.id, email: request.user.email });
        response.status(200).send('Your favorite is deleted!');
    } catch (error) {
        error.customMessage = 'Something went wrong when deleting your favorite: ';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.updateFavorite = async (request, response, next) => {
    const { id } = request.params;
    try {
        // Model.findByIdAndUpdate(id, updatedData, options)
        const comment = await Profiles.findOne({ _id: id, email: request.user.email });
        if (!comment) response.status(400).send('Unable to update comment');
        else {
            const updatedComment = await Profiles.findByIdAndUpdate(id, { ...request.body, email: request.user.email }, { new: true, overwrite: true });
            response.status(200).send(updatedComment);
        }
    } catch (error) {
        error.customMessage = 'Something went wrong when updating your profile: ';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.handleGetUser = (req, res) => {
    console.log('Getting the user');
    res.send(req.user);
};

module.exports = Handler;