const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

router.get('/:eventId', seatController.getSeatsByEvent);

module.exports = router;
