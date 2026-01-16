const express = require('express');
const { payEMI, getPaymentHistory } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/pay', auth, payEMI);
router.get('/history', auth, getPaymentHistory);

module.exports = router;
