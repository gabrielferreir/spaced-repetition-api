const mongoose = require('mongoose');
global.session;

mongoose.connect('mongodb://localhost:27017/spaced-repetition-flutter', {useNewUrlParser: true});

const mongoConnection = mongoose.connection;

mongoConnection.on('error', err => {
    console.log(err.message);
});

mongoConnection.once('open', function () {
    console.log('Conectado com sucesso! (Mongo)');
});

function getSession() {
    return global.session;
}

async function startTransaction() {
    global.session = await mongoose.startSession();
    global.session.startTransaction();
}

async function rollbackTransaction() {
    console.log(global.session);
    global.session.abortTransaction();
    global.session = null;
}

module.exports = {
    getSession,
    startTransaction,
    rollbackTransaction
};