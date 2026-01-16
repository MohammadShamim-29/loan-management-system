const express = require('express');
const { applyLoan, getLoans, updateLoanStatus } = require('../controllers/loanController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/apply', auth, applyLoan);
router.get('/', auth, getLoans); // Both admin (all) and user (own)
router.put('/:id/status', auth, updateLoanStatus);

module.exports = router;
