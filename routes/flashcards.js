const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const controller = require('../controllers/flashcards');

router.post('/', userController.authorize, controller.create);
router.get('/', userController.authorize, controller.read);
router.get('/refesh', userController.authorize, controller.refesh);
router.get('/revision/:id', userController.authorize, controller.revision);

module.exports = router;
