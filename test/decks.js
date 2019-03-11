const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const enviroment = require('./enviroment');

chai.use(chaiHttp);

describe('Decks Test', () => {

});

describe('Decks API Test', () => {

    it('should CREATE Deck', (done) => {
        chai.request(enviroment.url)
            .post('/decks')
            .set('authentication', enviroment.authentication)
            .send({
                name: `Deck ${new Date().toISOString()}`
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

});
