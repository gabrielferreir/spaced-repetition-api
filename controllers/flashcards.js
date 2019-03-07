const Schema = require('../schemas/Flashcards');
const crypto = require('../helpers/crypto/crypto');
const {Scope} = require('node-schema-validator');


module.exports = {
    create
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

        const tenMinutes = 1000 * 60 * 10;
        const nextRevision = new Date().getTime() + tenMinutes;
        params = {...params, nextRevision: nextRevision};

        Schema.create(params).then(response => {
            res.status(200).json({
                message: 'OK',
                id: response.id
            })
        }, err => {
            next(err)
        });

    } catch (error) {
        next(error);
    }
}
