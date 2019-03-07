const express = require('express');
const router = express.Router();
const controller = require('../controllers/flashcards');

router.post('/', controller.create);

module.exports = router;
