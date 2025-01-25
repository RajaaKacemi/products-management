const express = require('express');

const router = express.Router();

const reservationController = require('../controllers/reservationController');

router.get('/reservations', reservationController.getAllReservations);
router.post('/reservations', reservationController.addReservation);
router.delete('/reservations/:reservationId', reservationController.deleteReservation);

module.exports = router;