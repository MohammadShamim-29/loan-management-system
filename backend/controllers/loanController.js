const Loan = require('../models/Loan');

const applyLoan = async (req, res) => {
    try {
        const { amount, tenure, reason } = req.body;

        // Simple EMI calculation for schedule placeholder (can be refined later)
        // This will be properly generated upon approval usually, but we can init here.

        const loan = new Loan({
            userId: req.user.id,
            amount,
            tenure,
            reason,
            // documents will be handled separately or added here if URLs passed
        });

        await loan.save();
        res.status(201).json({ message: 'Loan application submitted successfully', loan });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getLoans = async (req, res) => {
    try {
        // If admin, return all loans. If user, return only own loans.
        let loans;
        if (req.user.role === 'admin') {
            loans = await Loan.find().populate('userId', 'name email');
        } else {
            loans = await Loan.find({ userId: req.user.id });
        }
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const { generateEMISchedule } = require('../utils/emiCalculator');

const updateLoanStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { status, adminRemarks } = req.body;
        const loan = await Loan.findById(req.params.id);

        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        loan.status = status;
        if (adminRemarks) loan.adminRemarks = adminRemarks;

        // If approved, verify/generate EMI schedule here
        if (status === 'approved' && (!loan.emiSchedule || loan.emiSchedule.length === 0)) {
            loan.emiSchedule = generateEMISchedule(loan.amount, loan.interestRate, loan.tenure);
        }

        await loan.save();
        res.json({ message: 'Loan status updated', loan });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { applyLoan, getLoans, updateLoanStatus };
