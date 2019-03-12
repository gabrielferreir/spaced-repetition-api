const chai = require('chai');
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

    it('should GET Deck', (done) => {
        chai.request(enviroment.url)
            .get('/decks')
            .set('authentication', enviroment.authentication)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.property('content').be.a('array');
                res.body.content[0].should.have.property('_id');
                res.body.content[0].should.have.property('name');
                done();
            })
    });

    it('should UPDATE Deck', (done) => {
        chai.request(enviroment.url)
            .put('/decks/5c826205a307b71e08da6050')
            .set('authentication', enviroment.authentication)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('should UPDATE Deck', (done) => {
        chai.request(enviroment.url)
            .put('/decks/5c826205a307b71e08da6050')
            .set('authentication', enviroment.authentication)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('should DELETE Deck', (done) => {
        chai.request(enviroment.url)
            .delete('/decks/5c826205a307b71e08da6050')
            .set('authentication', enviroment.authentication)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

});
