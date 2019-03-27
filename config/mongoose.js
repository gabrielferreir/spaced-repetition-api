const devEnviroments = require('../dev-enviroments.js');
const mongoose = require('mongoose');

const mongoenv = {
    host: process.env.MONGO_HOST || devEnviroments.host,
    port: process.env.MONGO_PORT || devEnviroments.port,
    db: process.env.MONGO_DB || devEnviroments.db,
    user: process.env.MONGO_USER || devEnviroments.user,
    pass: process.env.MONGO_PASS || devEnviroments.pass
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