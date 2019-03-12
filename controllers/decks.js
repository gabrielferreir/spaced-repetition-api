const Schema = require('../schemas/Decks');
const {Scope} = require('node-schema-validator');

module.exports = {
    create,
    read,
    update,
    remove
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
            idUser: req.user.id
        };

        const decks = await Schema.find({
            idUser: params.idUser
        });

        res.status(200).json({
            length: decks.length,
            content: decks
        });

    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {

        let params = {
            id: req.params.id,
            idUser: req.user.id
        };

        await Schema.findOne({
            _id: params.id,
            idUser: params.idUser
        });

        res.status(200).json({
            message: 'Alterado com sucesso'
        });

    } catch (error) {
        next(error);
    }
}

async function remove(req, res, next) {
    try {

        let params = {
            id: req.params.id,
            idUser: req.user.id
        };

        await Schema.findOne({
            _id: params.id,
            idUser: params.idUser
        }).deleteOne();

        res.status(200).json({
            message: 'Excluido com sucesso'
        });

    } catch (error) {
        next(error);
    }
}