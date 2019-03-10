const Schema = require('../schemas/Flashcards');
const {Scope} = require('node-schema-validator');
const BOX = require('../helpers/box/boxConstants');
const {refeshBox, nextDateRevison} = require('../services/flashcards');

module.exports = {
    create,
    read,
    refesh,
    revision
};

async function create(req, res, next) {
    try {
        let params = {
            question: req.body.question,
            answer: req.body.answer,
            idUser: req.user.id
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

async function refesh(req, res, next) {
    try {

        let params = {
            idUser: req.user.id,
            date: new Date().toISOString()
        };

        const flashcards = await Schema.find({
            idUser: params.idUser,
            nextRevision: {
                $lte: params.date
            }
        });

        let updateFlashcards = flashcards.map(_flashcard => refeshBox(_flashcard));

        for (let i = 0; i < updateFlashcards.length; i++) {
            await Schema.update({_id: updateFlashcards[i]._id}, updateFlashcards[i])
        }

        res.status(200).json({
            currentTime: params.date,
            length: flashcards.length,
            contentWithout: flashcards,
            content: updateFlashcards
        });


    } catch (error) {
        next(error);
    }
}

async function revision(req, res, next) {
    try {

        let params = {
            idFlashcard: req.params.id,
            idUser: req.user.id,
            currentDate: new Date()
        };

        const flashcard = await Schema.findOne({
            _id: params.idFlashcard,
            idUser: params.idUser
        });
        flashcard.nextRevision = nextDateRevison(params.currentDate, flashcard.box);

        await Schema.update({
            _id: params.idFlashcard,
            idUser: params.idUser
        }, flashcard);

        res.status(200).json({
            'message': 'OK'
        });


    } catch (error) {
        next(error);
    }
}
