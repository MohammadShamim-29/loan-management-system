import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    FiCalendar,
    FiCreditCard,
    FiCheckCircle,
    FiClock,
    FiPieChart,
    FiTrendingDown,
    FiAlertCircle,
    FiInfo,
    FiChevronDown
} from 'react-icons/fi';

const EMISchedule = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedLoans = async () => {
            try {
                // const token = await currentUser.getIdToken();
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/loans', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch loan data');
                }

                const data = await response.json();
                // Filter only approved loans for EMI schedule
                const approvedLoans = data.filter(loan => loan.status === 'approved');
                setLoans(approvedLoans);
                if (approvedLoans.length > 0) {
                    setSelectedLoan(approvedLoans[0]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching loans:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchApprovedLoans();
        }
    }, [currentUser]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateScheduleWithBalance = (loan) => {
        if (!loan || !loan.emiSchedule) return [];

        let remainingBalance = loan.amount;
        return loan.emiSchedule.map((emi) => {
            // In a real amortized schedule, balance would decrease by principal part
            // For this implementation, we'll show a simple linear reduction or just remaining
            // Since we don't have the principal/interest split stored, we'll estimate or just show total remaining
            // A common way to show this is "Balance after this payment"
            remainingBalance -= (loan.amount / loan.tenure); // Simplified linear reduction for display
            return {
                ...emi,
                remainingBalance: Math.max(0, Math.round(remainingBalance))
            };
        });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12 mt-16 max-w-6xl">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        EMI Repayment Schedule
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        View your monthly repayment plan, track paid installments, and monitor your remaining balance.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading schedule...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center max-w-md mx-auto">
                        <FiAlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                        <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
                        <p className="text-red-400 mb-6">{error}</p>
                    </div>
                ) : loans.length === 0 ? (
                    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                        <div className="bg-gray-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiInfo className="text-blue-400" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Active EMI Schedules</h2>
                        <p className="text-gray-400 mb-8">
                            Only approved loans have an EMI schedule. Once your application is approved, you'll see your repayment plan here.
                        </p>
                        <a href="/loan-status" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105">
                            Check Application Status
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Loan Selector & Summary Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                {/* Selector */}
                                <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-6">
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Select Loan Account</label>
                                    <div className="relative">
                                        <select
                                            value={selectedLoan?._id}
                                            onChange={(e) => setSelectedLoan(loans.find(l => l._id === e.target.value))}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        >
                                            {loans.map(loan => (
                                                <option key={loan._id} value={loan._id}>
                                                    {loan.reason} Loan - ৳{loan.amount.toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                            <FiChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Mini Card */}
                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl shadow-blue-500/10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-blue-100 text-sm font-medium mb-1">Monthly EMI</p>
                                            <h3 className="text-white text-3xl font-extrabold">৳{selectedLoan?.emiSchedule?.[0]?.amount.toLocaleString()}</h3>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-2xl">
                                            <FiCreditCard className="text-white" size={24} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-blue-100">Principal Amount</span>
                                            <span className="text-white font-bold">৳{selectedLoan?.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-blue-100">Total Interest</span>
                                            <span className="text-yellow-300 font-bold">
                                                ৳{selectedLoan?.emiSchedule?.[0]?.amount && selectedLoan?.tenure
                                                    ? ((selectedLoan.emiSchedule[0].amount * selectedLoan.tenure) - selectedLoan.amount).toLocaleString()
                                                    : '0'}
                                            </span>
                                        </div>
                                        <div className="border-t border-white/20 pt-3 flex justify-between text-sm">
                                            <span className="text-blue-100 font-semibold">Total Payable</span>
                                            <span className="text-white font-bold text-lg">
                                                ৳{selectedLoan?.emiSchedule?.[0]?.amount && selectedLoan?.tenure
                                                    ? (selectedLoan.emiSchedule[0].amount * selectedLoan.tenure).toLocaleString()
                                                    : '0'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-blue-100">Repayment Period</span>
                                            <span className="text-white font-bold">{selectedLoan?.tenure} Months</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-blue-100">Interest Rate</span>
                                            <span className="text-white font-bold">{selectedLoan?.interestRate}% p.a.</span>
                                        </div>
                                        <div className="w-full bg-black/20 h-2 rounded-full mt-6 overflow-hidden">
                                            <div
                                                className="bg-white h-full transition-all duration-1000"
                                                style={{ width: `${(selectedLoan?.emiSchedule?.filter(e => e.status === 'paid').length / selectedLoan?.tenure) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-blue-100/70 text-right mt-1">
                                            {selectedLoan?.emiSchedule?.filter(e => e.status === 'paid').length} of {selectedLoan?.tenure} paid
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Schedule Table */}
                            <div className="lg:col-span-2">
                                <section className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="p-6 md:p-8 border-b border-gray-700 flex justify-between items-center">
                                        <h2 className="text-xl font-bold flex items-center gap-3">
                                            <FiCalendar className="text-blue-400" /> Payment Schedule
                                        </h2>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">A/C: ...{selectedLoan?._id.substring(selectedLoan?._id.length - 6).toUpperCase()}</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                                <tr>
                                                    <th className="px-8 py-5">Month</th>
                                                    <th className="px-8 py-5">EMI Amount</th>
                                                    <th className="px-8 py-5">Due Date</th>
                                                    <th className="px-8 py-5">Status</th>
                                                    <th className="px-8 py-5 text-right">Balance</th>
                                                    <th className="px-8 py-5 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {calculateScheduleWithBalance(selectedLoan).map((emi, index) => (
                                                    <tr key={index} className="hover:bg-gray-700/30 transition-colors group">
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-3">
                                                                <span className="bg-gray-900/50 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                                    {emi.month}
                                                                </span>
                                                                <span className="text-gray-300 font-medium">Month {emi.month}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5 font-bold text-white">৳{emi.amount.toLocaleString()}</td>
                                                        <td className="px-8 py-5 text-gray-400 text-sm">{formatDate(emi.dueDate)}</td>
                                                        <td className="px-8 py-5">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${emi.status === 'paid'
                                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                }`}>
                                                                {emi.status === 'paid' ? <FiCheckCircle /> : <FiClock />}
                                                                {emi.status === 'paid' ? 'Paid' : 'Upcoming'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 text-right font-mono text-gray-400">
                                                            ৳{emi.remainingBalance.toLocaleString()}
                                                        </td>
                                                        <td className="px-8 py-5 text-center">
                                                            {emi.status === 'pending' && (
                                                                <button
                                                                    onClick={() => navigate(`/pay-emi/${selectedLoan._id}`)}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                                                                >
                                                                    Pay
                                                                </button>
                                                            )}
                                                            {emi.status === 'paid' && (
                                                                <span className="text-gray-600 text-xs font-medium italic">Confirmed</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-8 bg-gray-900/30">
                                        <div className="flex items-start gap-4 text-sm text-gray-500 max-w-lg">
                                            <FiTrendingDown className="flex-shrink-0 mt-1" size={18} />
                                            <p>The balance shown is an estimate based on the payment of each installment. Interest is calculated on the reducing principal balance.</p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default EMISchedule;
