import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiMessageSquare,
    FiCalendar,
    FiHash,
    FiAlertCircle,
    FiArrowRight
} from 'react-icons/fi';

const LoanStatus = () => {
    const { currentUser } = useAuth();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                // const token = await currentUser.getIdToken();
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/loans', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch loan applications');
                }

                const data = await response.json();
                setLoans(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching loans:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchLoans();
        }
    }, [currentUser]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return {
                    color: 'text-green-400',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    icon: <FiCheckCircle />,
                    label: 'Approved'
                };
            case 'rejected':
                return {
                    color: 'text-red-400',
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    icon: <FiXCircle />,
                    label: 'Rejected'
                };
            default:
                return {
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    icon: <FiClock />,
                    label: 'Pending'
                };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12 mt-16 max-w-4xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Track Application
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Stay updated on your loan application status in real-time.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Loading your applications...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                        <FiAlertCircle className="mx-auto text-red-400 mb-4" size={48} />
                        <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                        <p className="text-red-400 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loans.length === 0 ? (
                    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-12 text-center">
                        <div className="bg-gray-900/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiMessageSquare className="text-gray-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">No Applications Found</h2>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                            You haven't submitted any loan applications yet. Start your journey with us today!
                        </p>
                        <a
                            href="/apply-loan"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
                        >
                            Apply Now <FiArrowRight />
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {loans.map((loan) => {
                            const config = getStatusConfig(loan.status);
                            return (
                                <div key={loan._id} className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-blue-500/30">
                                    {/* Header Section */}
                                    <div className="p-6 md:p-8 border-b border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl ${config.bg} ${config.color}`}>
                                                {React.cloneElement(config.icon, { size: 32 })}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                                    <FiHash /> ID: <span className="font-mono text-gray-300">{loan._id.substring(loan._id.length - 8).toUpperCase()}</span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-white capitalize">
                                                    {loan.reason} Loan
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${config.bg} ${config.color} ${config.border} mb-2`}>
                                                {config.label}
                                            </span>
                                            <div className="text-sm text-gray-400 flex items-center gap-2">
                                                <FiCalendar /> Updated: {formatDate(loan.updatedAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3">Loan Details</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-700/30">
                                                        <p className="text-gray-500 text-xs mb-1">Amount</p>
                                                        <p className="text-white font-bold">৳{loan.amount.toLocaleString()}</p>
                                                    </div>
                                                    <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-700/30">
                                                        <p className="text-gray-500 text-xs mb-1">Tenure</p>
                                                        <p className="text-white font-bold">{loan.tenure} Months</p>
                                                    </div>
                                                    {loan.status === 'approved' && (
                                                        <>
                                                            <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-700/30">
                                                                <p className="text-gray-500 text-xs mb-1">Interest Rate</p>
                                                                <p className="text-white font-bold">{loan.interestRate}% p.a.</p>
                                                            </div>
                                                            <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-700/30">
                                                                <p className="text-gray-500 text-xs mb-1">Monthly EMI</p>
                                                                <p className="text-green-400 font-bold">৳{loan.emiSchedule?.[0]?.amount.toLocaleString()}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {loan.adminRemarks && (
                                                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5">
                                                    <h3 className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                                                        <FiMessageSquare /> Admin Remarks
                                                    </h3>
                                                    <p className="text-indigo-100 italic">"{loan.adminRemarks}"</p>
                                                </div>
                                            )}

                                            {/* EMI Calculation Summary for Approved Loans */}
                                            {loan.status === 'approved' && loan.emiSchedule && loan.emiSchedule.length > 0 && (
                                                <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6">
                                                    <h3 className="text-green-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                                                        <FiCheckCircle /> Loan Approved - EMI Breakdown
                                                    </h3>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-400 text-sm">Principal Amount</span>
                                                            <span className="text-white font-semibold">৳{loan.amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-400 text-sm">Total Interest</span>
                                                            <span className="text-yellow-400 font-semibold">
                                                                ৳{((loan.emiSchedule[0].amount * loan.tenure) - loan.amount).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="border-t border-gray-700/50 pt-3 flex justify-between items-center">
                                                            <span className="text-white font-bold">Total Payable</span>
                                                            <span className="text-green-400 font-bold text-lg">
                                                                ৳{(loan.emiSchedule[0].amount * loan.tenure).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                                        <a
                                                            href="/emi-schedule"
                                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
                                                        >
                                                            <FiCalendar /> View Schedule
                                                        </a>
                                                        <a
                                                            href={`/pay-emi/${loan._id}`}
                                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all"
                                                        >
                                                            <FiArrowRight /> Pay EMI
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Timeline / Steps */}
                                        <div className="space-y-4">
                                            <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-3">Application Progress</h3>
                                            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-700">
                                                <div className="flex gap-4 relative">
                                                    <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-500/20 z-10 transition-transform hover:scale-125"></div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm leading-none">Application Submitted</p>
                                                        <p className="text-gray-500 text-xs mt-1">{formatDate(loan.createdAt)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 relative">
                                                    <div className={`w-4 h-4 rounded-full z-10 ${loan.status !== 'pending' ? 'bg-green-500 ring-4 ring-green-500/20' : 'bg-blue-500 ring-4 ring-blue-500/20 animate-pulse'}`}></div>
                                                    <div>
                                                        <p className={`font-medium text-sm leading-none ${loan.status !== 'pending' ? 'text-white' : 'text-blue-400'}`}>
                                                            Under Review
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {loan.status === 'pending' ? 'Our team is processing your request' : 'Review completed'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 relative">
                                                    <div className={`w-4 h-4 rounded-full z-10 ${loan.status === 'approved' ? 'bg-green-500 ring-4 ring-green-500/20' :
                                                        loan.status === 'rejected' ? 'bg-red-500 ring-4 ring-red-500/20' :
                                                            'bg-gray-700'
                                                        }`}></div>
                                                    <div>
                                                        <p className={`font-medium text-sm leading-none ${loan.status === 'approved' ? 'text-green-400' :
                                                            loan.status === 'rejected' ? 'text-red-400' :
                                                                'text-gray-500'
                                                            }`}>
                                                            Final Decision
                                                        </p>
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            {loan.status === 'pending' ? 'Awaiting final approval' : `Status updated on ${formatDate(loan.updatedAt)}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default LoanStatus;
