const Payment = require('../models/Payment');
const Loan = require('../models/Loan');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: 'bdt',
            metadata: { userId: req.user.id },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: 'Stripe Error', error: error.message });
    }
};

const payEMI = async (req, res) => {
    try {
        const { loanId, amount, paymentId } = req.body;

        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ message: 'Loan not found' });

        const payment = new Payment({
            loanId,
            userId: req.user.id,
            amount,
            status: 'success',
            stripePaymentId: paymentId // Save the stripe payment ID if provided
        });

        await payment.save();

        // Update Loan EMI Schedule Status
        // Logic: Find the earliest 'pending' EMI and mark it as 'paid'
        const pendingEMI = loan.emiSchedule.find(emi => emi.status === 'pending');
        if (pendingEMI) {
            pendingEMI.status = 'paid';
            await loan.save();
        }

        res.status(201).json({ message: 'Payment recorded successfully', payment });
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

const getAllPayments = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const payments = await Payment.find()
            .populate('userId', 'name email phone')
            .populate('loanId', 'amount reason status');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { payEMI, createPaymentIntent, getPaymentHistory, getAllPayments };
