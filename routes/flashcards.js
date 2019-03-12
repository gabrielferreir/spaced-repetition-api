const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const controller = require('../controllers/flashcards');

router.post('/', userController.authorize, controller.create);
router.get('/', userController.authorize, controller.getFlashcardsRevision);
router.get('/refesh', userController.authorize, controller.refesh);
router.get('/:idDeck', userController.authorize, controller.getFlashcards);
router.put('/revision/:id', userController.authorize, controller.revision);

module.exports = router;
