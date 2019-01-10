const Schema = require('../schemas/Users');
const crypto = require('../helpers/crypto/crypto');
const {Scope} = require('node-schema-validator');
const jwt = require('jsonwebtoken');
const KEY = 'dev';


module.exports = {
    create,
    update,
    read,
    remove,
    login,
    decode,
    authorize,
    checkEmail
};

async function create(req, res, next) {
    try {
        const params = {
            name: req.body.name,
            email: req.body.email,
            pass: crypto.encryptMd5(req.body.pass),
            image: req.body.image,
            phone: req.body.phone,
        };

        const schema = {
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 32
            },
            email: {
                isEmail: true,
                required: true
            },
            pass: {
                type: String,
                maxLength: 32
            },
            phone: {
                type: String,
                maxLength: 11,
                minLength: 8
            }
        };

        const scope = new Scope();
        scope.isValid(params, schema);

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

async function update(req, res, next) {
    try {
        const params = {
            name: req.body.name,
            email: req.body.email,
            pass: crypto.encryptMd5(req.body.pass),
            image: req.body.image,
            phone: req.body.phone,
        };

        const schema = {
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 32
            },
            email: {
                isEmail: true,
                required: true
            },
            pass: {
                type: String,
                maxLength: 32
            },
            phone: {
                type: String,
                maxLength: 11,
                minLength: 8
            }
        };

        const scope = new Scope();
        scope.isValid(params, schema);

        Schema.findOneAndUpdate({_id: req.params.id}, {
            ...req.body,
            pass: crypto.encryptMd5(req.body.pass)
        }, null, (err, doc) => {
            if (err) next(err);

            return res.status(200).json({message: 'OK'});
        });
    } catch (err) {
        next(err);
    }
}

async function read(req, res, next) {
    try {
        Schema.findById(req.params.id, (err, user) => {
            if (err) next(err);
            return res.status(200).json(user || {});
        });
    } catch (e) {
        next(e);
    }
}

async function remove(req, res, next) {
    try {
        Schema.remove({_id: req.params.id}, err => {
            if (err) next(err);
            return res.status(200).json({message: 'OK'});
        });
    } catch (e) {

    }

}

async function login(req, res, next) {
    try {
        const params = {
            email: req.body.email,
            pass: req.body.pass
        };

        const schema = {
            email: {
                required: true,
                isEmail: true
            },
            pass: {
                required: true,
                maxLength: 32
            }
        };

        const scope = new Scope();

        scope.isValid(params, schema);

        Schema.find({email: params.email, pass: crypto.encryptMd5(params.pass)}, async (err, user) => {
            if (err) next(err);
            if (!user.length) {
                return res.status(404).json({
                    message: 'Usuario não encontrado'
                })
            }

            params.id = user[0]._id;
            const token = await jwt.sign(params, KEY);
            return res.json({
                content: {
                    token: token,
                    user: user[0]
                }
            })
        });
    } catch (error) {
        next(error);
    }
}

async function checkEmail(req, res, next) {
    try {
        const params = {
            email: req.body.email,
        };

        const schema = {
            email: {
                required: true,
                isEmail: true
            }
        };

        const scope = new Scope();

        scope.isValid(params, schema);

        Schema.find({email: params.email}, async (err, user) => {
            if (err) next(err);
            if (!user.length) {
                return res.status(404).json({
                    message: 'Usuario não encontrado'
                })
            }
            return res.json({
                content: user[0]
            })
        });
    } catch (error) {
        next(error);
    }
}

async function decode(req, res, next) {
    console.log('decode');

    try {

        const params = {
            token: req.params.token
        };

        const schema = {
            token: {
                required: true
            }
        };

        const scope = new Scope();

        scope.isValid(params, schema);

        let info = await jwt.verify(params.token, KEY);

        if (info.error) {
            return res.status(404).json({error: info.error})
        }

        Schema.find({email: info.email, pass: crypto.encryptMd5(info.pass)}, async (err, user) => {
            if (err) next(err);
            if (!user.length) {
                return res.status(404).json({
                    message: 'Usuario não encontrado'
                })
            }
            params.id = user[0]._id;
            const token = await jwt.sign(params, KEY);
            return res.json({
                content: {
                    token: token,
                    user: user[0]
                }
            })
        });

    } catch (error) {
        next(error);
    }
}

async function generateToken(data) {
    return jwt.sign(data, KEY);
}

async function decodeToken(token) {
    try {
        const data = await jwt.verify(token, KEY);
        return data;
    } catch (error) {
        return {
            error: error
        };
    }
}

async function authorize(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['authentication'];

    if (!token) {
        return res.status(401).json({
            message: 'Acesso restrito'
        });
    } else {
        jwt.verify(token, KEY, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    message: 'Token inválido'
                });
            } else {
                next();
            }
        });
    }
}

