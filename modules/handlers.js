'use strict';

// import schema model
// const Profile = require('../models/');

const Handler = {};

Handler.getProfile = async (request, response, next) => {
    try {
        const profiles = await Profile.find({ email: request.user.email });
        response.status(200).send(profiles);
    } catch (error) {
        error.customMessage = 'Something went wrong when getting your profile';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.createProfile = async (request, response, next) => {
    try {
        const profile = await Profile.create({ ...request.body, email: request.user.email });
        response.status(201).send(profile);
    } catch (error) {
        error.customMessage = 'Something went wrong when creating your profile';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.deleteProfile = async (request, response, next) => {
    try {
        await Profile.findByIdAndDelete({ ...request.params.id, email: request.user.email });
        response.status(200).send('your profile is deleted!');
    } catch (error) {
        error.customMessage = 'Something went wrong when deleting your profile: ';
        console.error(error.customMessage + error);
        next(error);
    }
};

Handler.updateProfile = async (request, response, next) => {
    const { id } = request.params;
    try {
        // Model.findByIdAndUpdate(id, updatedData, options)
        const profile = await Profile.findOne({ _id: id, email: request.user.email });
        if (!profile) response.status(400).send('unable to update profile');
        else {
            const updatedProfile = await Profile.findByIdAndUpdate(id, { ...request.body, email: request.user.email }, { new: true, overwrite: true });
            response.status(200).send(updatedProfile);
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