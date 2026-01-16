const Loan = require('../models/Loan');

const applyLoan = async (req, res) => {
    try {
        const { amount, tenure, reason, documents } = req.body;

        // Simple EMI calculation for schedule placeholder (can be refined later)
        // This will be properly generated upon approval usually, but we can init here.

        const loan = new Loan({
            userId: req.user.id,
            amount,
            tenure,
            reason,
            documents // Save the documents array
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

const { generateEMISchedule, calculateTotalAmount } = require('../utils/emiCalculator');

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

            // Calculate and store total amounts
            const { totalAmount, totalInterest } = calculateTotalAmount(loan.amount, loan.interestRate, loan.tenure);
            loan.totalPayable = totalAmount;
            loan.totalInterest = totalInterest;
        }

        await loan.save();
        res.json({ message: 'Loan status updated', loan });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const stats = await Loan.aggregate([
            {
                $group: {
                    _id: null,
                    totalApplications: { $sum: 1 },
                    approvedLoans: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
                    },
                    pendingLoans: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    totalAmountDisbursed: {
                        $sum: { $cond: [{ $eq: ["$status", "approved"] }, "$amount", 0] }
                    }
                }
            }
        ]);

        const result = stats.length > 0 ? stats[0] : {
            totalApplications: 0,
            approvedLoans: 0,
            pendingLoans: 0,
            totalAmountDisbursed: 0
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { applyLoan, getLoans, updateLoanStatus, getAdminStats };
