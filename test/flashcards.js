const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const enviroment = require('./enviroment');
const {refeshBox, nextDateRevison} = require('../services/flashcards');
const mongoose = require('../config/mongoose');

chai.use(chaiHttp);

const FLASHCARDS = {
    'box': 4,
    'nextRevision': '2019-03-09T18:00:00.000Z' // GMT + 3:00
};

describe('Flashcard Test', () => {

    it('Should return a ideal next revision refeshBox', () => {
        // WITH FREQUENCY 1.0
        const idealDate = refeshBox(FLASHCARDS)
        const idealDateResponse = {
            'box': 1,
            'nextRevision': new Date('2019-03-09T20:40:00.000Z') // GMT + 3:00
        };
        assert.deepEqual(idealDate, idealDateResponse);
    });

    it('Should return next date revision', () => {
        const currentDate = new Date('2019-03-09T18:00:00.000Z');
        const currentBox = 1;
        const dateRevison = new Date('2019-03-09T18:10:00.000Z');
        const nextDate = nextDateRevison(currentDate, currentBox);
        assert.deepEqual(dateRevison, nextDate);
    })

});

describe('Flashcard API Test', () => {

    // beforeEach(done => {
    //     console.log('beforeEach');
    //     mongoose.startTransaction().then(() => done());
    // });
    //
    // afterEach(done => {
    //     console.log('afterEach');
    //     mongoose.rollbackTransaction().then(() => done());
    // });

    it('should GET flashcards', (done) => {
        chai.request(enviroment.url)
            .get('/flashcards')
            .set('authentication', enviroment.authentication)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('should CREATE flashcards', (done) => {
        chai.request(enviroment.url)
            .post('/flashcards')
            .set('authentication', enviroment.authentication)
            .set('test', true)
            .send({
                question: `Question 01 ${new Date().toISOString()}`,
                answer: "Answer 01",
                idDeck: '5c87e1159606084658f58511'
            })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

    it('should REFESH flashcards', (done) => {
        chai.request(enviroment.url)
            .get('/flashcards/refesh')
            .set('authentication', enviroment.authentication)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    });

});
