const Schema = require('../schemas/Flashcards');
const deckSchema = require('../schemas/Decks');
const {Scope} = require('node-schema-validator');
const {Types} = require('mongoose');
const BOX = require('../helpers/box/boxConstants');
const {refeshBox, nextDateRevison} = require('../services/flashcards');

module.exports = {
    create,
    getFlashcardsRevision,
    getFlashcards,
    refesh,
    revision
};

async function create(req, res, next) {
    try {
        let params = {
            question: req.body.question,
            answer: req.body.answer,
            idUser: req.user.id,
            idDeck: req.body.idDeck
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
            },
            idDeck: {
                type: String,
                required: true,
                Function: value => {
                    if (!Types.ObjectId.isValid(params.idDeck)) {
                        return {
                            message: `Is not ObjectId type`,
                            type: 'ObjectId'
                        };
                    }
                }
            }
        };

        const scope = new Scope();
        scope.isValid(params, schema);

        const deck = await deckSchema.findOne({_id: params.idDeck});

        if (!deck) {
            return res.status(400).json({
                message: 'Esse Deck não foi encontrado'
            })
        }

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

async function getFlashcardsRevision(req, res, next) {
    try {

        let params = {
            quantity: req.query.quantity || 100,
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
            content: flashcards
        });

    } catch (error) {
        next(error);
    }
}

async function getFlashcards(req, res, next) {
    try {

        let params = {
            quantity: req.query.quantity || 100,
            idUser: req.user.id,
            idDeck: req.params.idDeck
        };

        const flashcards = await Schema.find({
            idUser: params.idUser,
            idDeck: params.idDeck
        }).limit(params.quantity);

        res.status(200).json({
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

        if (!flashcard) {
            return res.status(404).json({
                message: 'Flashcard não encontrado'
            });
        }

        flashcard.nextRevision = nextDateRevison(params.currentDate, flashcard.box);
        flashcard.box = flashcard.box + 1;

        await Schema.update({
            _id: params.idFlashcard,
            idUser: params.idUser
        }, flashcard);

        res.status(200).json({
            'message': 'OK',
            'nextRevision': flashcard.nextRevision
        });


    } catch (error) {
        next(error);
    }
}
