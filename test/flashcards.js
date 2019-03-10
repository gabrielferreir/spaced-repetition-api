const assert = require('assert');
const {refeshBox, nextDateRevison} = require('../services/flashcards');

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
