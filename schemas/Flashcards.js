const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const Flashcards = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    idDeck: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Deck',
        required: true
    },
    box: {
        type: Number,
        default: 1
    },
    nextRevision: {
        type: Date,
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

module.exports = mongoose.model('Flashcards', Flashcards);
