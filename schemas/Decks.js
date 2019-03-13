const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const Decks = new Schema({
    name: {
        type: String,
        required: true
    },
    idUser: {
        type: String,
        required: true
    },
    registrationData: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Decks', Decks);