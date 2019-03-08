const Schema = require('../schemas/Flashcards');
const {Scope} = require('node-schema-validator');
const BOX = require('../helpers/box/boxConstants');

module.exports = {
    create,
    read
};

async function create(req, res, next) {
    try {
        let params = {
            question: req.body.question,
            answer: req.body.answer,
        };

        const schema = {
            question: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 500
            },
            answer: {
                type: String,
                required: true,
                minLength: 1,
                maxLength: 500
            }
        };

        const scope = new Scope();
        scope.isValid(params, schema);

        const nextRevision = new Date().getTime() + BOX["1"].time;
        params = {...params, nextRevision: nextRevision};

        const flashcard = await Schema.create(params);

        res.status(200).json({
            message: 'OK',
            id: flashcard.id
        })

    } catch (error) {
        next(error);
    }
}

async function read(req, res, next) {
    try {

        let params = {
            quantity: req.query.quantity || 10,
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
