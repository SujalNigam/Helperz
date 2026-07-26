const { createBooking, getProviderBookings, updateBookingStatus,getCustomerBookings, cancelBooking,getBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.post('/createBooking',authMiddleware,createBooking);
router.get('/getProviderBookings',authMiddleware,getProviderBookings);
router.get('/getBookings',authMiddleware,getBookings);
router.get('/getCustomerBookings',authMiddleware,getCustomerBookings);
router.put('/:bookingId/status',authMiddleware,updateBookingStatus);
router.patch('/:bookingId/cancelBooking',authMiddleware,cancelBooking);


module.exports = router;
