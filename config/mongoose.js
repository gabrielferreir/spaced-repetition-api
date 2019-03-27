const mongoose = require('mongoose');

const mongoenv = {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    db: process.env.MONGO_DB,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS
};

console.log(`mongodb://${mongoenv.user}:${mongoenv.pass}@${mongoenv.host}:${mongoenv.port}/${mongoenv.db}`);
mongoose.connect(`mongodb://${mongoenv.user}:${mongoenv.pass}@${mongoenv.host}:${mongoenv.port}/${mongoenv.db}`, {useNewUrlParser: true});

const mongoConnection = mongoose.connection;

mongoConnection.on('error', err => {
    console.log(err.message);
});

mongoConnection.once('open', function () {
    console.log('Conectado com sucesso! (Mongo)');
});