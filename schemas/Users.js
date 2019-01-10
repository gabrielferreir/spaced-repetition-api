const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
    },
    registrationData: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', User);