const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // in months
    interestRate: { type: Number, default: 8.0 }, // Fixed 8% for now
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    documents: [{ type: String }], // Array of file paths/URLs
    adminRemarks: { type: String, default: '' },
    totalPayable: { type: Number },
    totalInterest: { type: Number },
    emiSchedule: [{
        month: { type: Number }, // 1 to tenure
        dueDate: { type: Date },
        amount: { type: Number },
        status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
