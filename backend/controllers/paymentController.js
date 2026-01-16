const Payment = require('../models/Payment');
const Loan = require('../models/Loan');

const payEMI = async (req, res) => {
    try {
        const { loanId, amount } = req.body;

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        // In a real app, verify amount matches due EMI, etc.
        // Also integrate with payment gateway here (Mock for now).

        const payment = new Payment({
            loanId,
            userId: req.user.id,
            amount,
            status: 'success'
        });

        await payment.save();

        // Update Loan EMI Schedule Status
        // Logic: Find the earliest 'pending' EMI and mark it as 'paid'
        const pendingEMI = loan.emiSchedule.find(emi => emi.status === 'pending');
        if (pendingEMI) {
            pendingEMI.status = 'paid';
            await loan.save();
        }

        res.status(201).json({ message: 'Payment successful', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.id }).populate('loanId', 'amount status');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { payEMI, getPaymentHistory };
