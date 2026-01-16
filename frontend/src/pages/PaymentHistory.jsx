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
    FiDownload,
    FiAlertCircle,
    FiInfo,
    FiChevronDown,
    FiArrowLeft
} from 'react-icons/fi';

const PaymentHistory = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                const token = await currentUser.getIdToken();
                const response = await fetch('http://localhost:5000/api/payments/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch payment history');
                }

                const data = await response.json();
                setPayments(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching payment history:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchPaymentHistory();
        }
    }, [currentUser]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12 mt-16 max-w-6xl">
                {/* Page Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4 group"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </button>
                        <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            Payment History
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Track all your EMI transactions and download receipts for your records.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading your transactions...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center max-w-md mx-auto">
                        <FiAlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                        <h2 className="text-xl font-bold text-white mb-2">Error Loading History</h2>
                        <p className="text-red-400 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold"
                        >
                            Retry
                        </button>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                        <div className="bg-gray-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiCreditCard className="text-blue-400" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Transactions Found</h2>
                        <p className="text-gray-400 mb-8">
                            You haven't made any EMI payments yet. Your transaction history will appear here once you start paying.
                        </p>
                        <button
                            onClick={() => navigate('/emi-schedule')}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
                        >
                            View EMI Schedule
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <section className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 md:p-8 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    <FiPieChart className="text-blue-400" /> Recent Transactions
                                </h2>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{payments.length} Payments Recorded</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                        <tr>
                                            <th className="px-8 py-5">Date & Time</th>
                                            <th className="px-8 py-5">Loan Reference</th>
                                            <th className="px-8 py-5">Amount</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-center">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {payments.map((payment, index) => (
                                            <tr key={payment._id} className="hover:bg-gray-700/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-gray-900/50 p-2 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                            <FiCalendar size={18} />
                                                        </div>
                                                        <span className="text-gray-300 font-medium">{formatDate(payment.createdAt)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div>
                                                        <p className="text-white font-bold">ID: ...{payment.loanId?._id?.substring(payment.loanId?._id?.length - 6).toUpperCase() || 'N/A'}</p>
                                                        <p className="text-xs text-gray-500">Loan Amount: ৳{payment.loanId?.amount?.toLocaleString() || '0'}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-white text-lg">৳{payment.amount.toLocaleString()}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${payment.status === 'success'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {payment.status === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                                                        {payment.status === 'success' ? 'Success' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <button
                                                        onClick={() => alert('Receipt download feature coming soon!')}
                                                        className="p-2 bg-gray-700/50 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg transition-all"
                                                        title="Download Receipt"
                                                    >
                                                        <FiDownload size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="flex items-center gap-4 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <FiInfo className="text-blue-400 flex-shrink-0" size={24} />
                            <p className="text-gray-400 text-sm">
                                It may take up to 24 hours for your payment status to reflect in your bank statement. If you encounter any issues, please contact our support team.
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default PaymentHistory;
