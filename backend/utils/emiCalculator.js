/**
 * Calculate Equal Monthly Installment (EMI)
 * Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
 * P: Principal loan amount
 * r: Monthly interest rate (Annual Rate / 12 / 100)
 * n: Loan duration in months
 */
const calculateEMI = (principal, annualRate, months) => {
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi); // Round to nearest integer for simplicity
};

/**
 * Generate EMI Schedule
 */
const generateEMISchedule = (amount, rate, tenure) => {
    const emiAmount = calculateEMI(amount, rate, tenure);
    const schedule = [];
    let currentDate = new Date();

    for (let i = 1; i <= tenure; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        schedule.push({
            month: i,
            dueDate: new Date(currentDate),
            amount: emiAmount,
            status: 'pending'
        });
    }
    return schedule;
};

/**
 * Calculate Total Amount Payable (Principal + Interest)
 */
const calculateTotalAmount = (principal, annualRate, months) => {
    const emiAmount = calculateEMI(principal, annualRate, months);
    const totalAmount = emiAmount * months;
    const totalInterest = totalAmount - principal;
    return {
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest),
        emiAmount: Math.round(emiAmount)
    };
};

module.exports = { calculateEMI, generateEMISchedule, calculateTotalAmount };
