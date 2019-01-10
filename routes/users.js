const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

router.post('/', controller.create);
router.put('/:id', controller.authorize, controller.update);
router.get('/:id', controller.read);
router.delete('/:id', controller.authorize, controller.remove);
router.post('/login', controller.login);
router.get('/refazer/:token', controller.decode);
router.post('/check-email', controller.checkEmail);

module.exports = router;
