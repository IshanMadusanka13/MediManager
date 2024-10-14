const express = require('express');
const router = express.Router();
const healthCardController = require('../controllers/healthcardController');


router.post('/submit', healthCardController.createHealthCard);
router.get('/exists/:email', healthCardController.checkHealthCardExists);

router.get('/:email', healthCardController.getHealthCardByEmail);

module.exports = router;
