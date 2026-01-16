const express = require('express');
const { payEMI, createPaymentIntent, getPaymentHistory, getAllPayments } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/pay', auth, payEMI);
router.post('/create-intent', auth, createPaymentIntent);
router.get('/history', auth, getPaymentHistory);
router.get('/all', auth, getAllPayments);

module.exports = router;
