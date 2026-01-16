const express = require('express');
const { applyLoan, getLoans, updateLoanStatus, getAdminStats } = require('../controllers/loanController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/apply', auth, applyLoan);
router.get('/', auth, getLoans); // Both admin (all) and user (own)
router.get('/stats', auth, getAdminStats);
router.put('/:id/status', auth, updateLoanStatus);

module.exports = router;
