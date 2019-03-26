const mongoose = require('mongoose');
const mongoenv = {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    db: process.env.MONGO_DB || 'spaced-repetition-flutter',
    user: process.env.MONGO_USER || null,
    passs: process.env.MONGO_PASS || null,
};
mongoose.connect(`mongodb://${mongoenv.user}:${mongoenv.passs}@${mongoenv.host}:${mongoenv.port}/${mongoenv.db}`, {useNewUrlParser: true});

const mongoConnection = mongoose.connection;

mongoConnection.on('error', err => {
    console.log(err.message);
});

mongoConnection.once('open', function () {
    console.log('Conectado com sucesso! (Mongo)');
});