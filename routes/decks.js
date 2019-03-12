const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const controller = require('../controllers/decks');

router.post('/', userController.authorize, controller.create);
router.get('/', userController.authorize, controller.read);
router.put('/:id', userController.authorize, controller.update);
router.delete('/:id', userController.authorize, controller.remove);

module.exports = router;
