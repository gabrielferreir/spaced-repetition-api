const BOX = require('../helpers/box/boxConstants');
const FORGETTING_FREQUENCY = 1.0;

/*
    Recebe um flashcard
    Soma a data de revisão o valor do tempo das caixas anteriores
    Ate que o valor da data da revisão fique <= a data atual
*/
function refeshBox(flashcard) {
    const dateRevision = new Date(flashcard.nextRevision).getTime();
    const currentBox = flashcard.box;
    const currentTime = new Date().getTime();
    const currentRevison = _findIdealDateReview(dateRevision, currentBox, currentTime);
    flashcard.nextRevision = new Date(currentRevison.date);
    flashcard.box = currentRevison.box;
    return flashcard;
}

function nextDateRevison(currentDate, currentBox) {
    const milliseconds = new Date(currentDate).getTime() + BOX[currentBox + 1].time;
    return new Date(milliseconds);
}

function _findIdealDateReview(dateRevision, currentBox, currentTime) {
    if (currentBox > 1) {
        const timeBoxWithFrequency = BOX[currentBox].time * FORGETTING_FREQUENCY;
        const idealTime = timeBoxWithFrequency + dateRevision;
        return idealTime <= currentTime ?
            _findIdealDateReview(idealTime, currentBox - 1, currentTime) :
            dateRevision;
    }
    return {date: dateRevision, box: currentBox}
}


module.exports = {
    refeshBox,
    nextDateRevison
};
