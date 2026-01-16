const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
