const Schema = require('../schemas/Decks');
const {Scope} = require('node-schema-validator');
const BOX = require('../helpers/box/boxConstants');

module.exports = {
    create,
    read
};

async function create(req, res, next) {
    try {
        let params = {
            name: req.body.name,
            idUser: req.user.id
        };

        const schema = {
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 100
            }
        };

        const scope = new Scope();
        scope.isValid(params, schema);

        const deck = await Schema.create(params);

        res.status(200).json({
            message: 'OK',
            id: deck.id
        })

    } catch (error) {
        next(error);
    }
}

async function read(req, res, next) {
    try {

        let params = {
            quantity: req.query.quantity || 10,
            idUser: req.user.id,
            date: new Date().toISOString()
        };

        const schema = {
            quantity: {
                type: Number,
                required: true
            }
        };

        const scope = new Scope();

        scope.isValid(params, schema);

        const flashcards = await Schema.find({
            idUser: params.idUser,
            nextRevision: {
                $lte: params.date
            }
        }).limit(params.quantity);

        res.status(200).json({
            currentTime: params.date,
            length: flashcards.length,
            content: flashcards
        });

    } catch (error) {
        next(error);
    }
}