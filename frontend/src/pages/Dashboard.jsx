import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    FiHome,
    FiFileText,
    FiCreditCard,
    FiPieChart,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiUser
} from 'react-icons/fi';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({
        totalApplied: 0,
        activeLoans: 0,
        pendingApprovals: 0,
        nextEmiAmount: 0,
        nextEmiDate: 'N/A'
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // const token = await currentUser.getIdToken();
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/loans', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch loans');

                const data = await response.json();

                if (Array.isArray(data)) {
                    setLoans(data);

                    const approved = data.filter(l => l.status === 'approved');
                    const pending = data.filter(l => l.status === 'pending');

                    // Get next EMI from first approved loan
                    let nextEmiVal = 0;
                    let nextEmiDateVal = 'N/A';

                    if (approved.length > 0) {
                        const nextEmiItem = approved[0].emiSchedule.find(e => e.status === 'pending');
                        if (nextEmiItem) {
                            nextEmiVal = nextEmiItem.amount;
                            nextEmiDateVal = new Date(nextEmiItem.dueDate).toLocaleDateString('en-BD', { month: 'short', day: 'numeric' });
                        }
                    }

                    setStats({
                        totalApplied: data.length,
                        activeLoans: approved.length,
                        pendingApprovals: pending.length,
                        nextEmiAmount: nextEmiVal,
                        nextEmiDate: nextEmiDateVal
                    });
                } else {
                    console.error('Expected array of loans but got:', data);
                    setLoans([]);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        if (currentUser) {
            fetchDashboardData();
        }
    }, [currentUser]);

    const activeLoan = loans.find(l => l.status === 'approved');

    const StatusCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/20 text-${color}-400`}>
                    <Icon size={24} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                    Overall
                </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 mt-16">
                {/* Welcome Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Welcome back, {currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'User')}!
                    </h1>
                    <p className="text-gray-400 mt-2">Here's what's happening with your loans today.</p>
                </div>

                {/* Approval Notifications */}
                {loans.filter(l => l.status === 'approved' || l.status === 'rejected').length > 0 && (
                    <div className="mb-8 space-y-4">
                        {loans.filter(l => l.status === 'approved').map(loan => (
                            <div key={loan._id} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-md">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-500/20 rounded-xl">
                                        <FiCheckCircle className="text-green-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-green-400 font-bold text-lg mb-1">
                                            🎉 Loan Approved!
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-3">
                                            Your <span className="font-semibold capitalize">{loan.reason}</span> loan of <span className="font-semibold">৳{loan.amount.toLocaleString()}</span> has been approved.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="bg-gray-900/40 p-3 rounded-xl">
                                                <p className="text-gray-500 text-xs mb-1">Monthly EMI</p>
                                                <p className="text-white font-bold">৳{loan.emiSchedule?.[0]?.amount.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gray-900/40 p-3 rounded-xl">
                                                <p className="text-gray-500 text-xs mb-1">Total Payable</p>
                                                <p className="text-green-400 font-bold">
                                                    ৳{loan.emiSchedule?.[0]?.amount && loan.tenure
                                                        ? (loan.emiSchedule[0].amount * loan.tenure).toLocaleString()
                                                        : '0'}
                                                </p>
                                            </div>
                                            <div className="bg-gray-900/40 p-3 rounded-xl">
                                                <p className="text-gray-500 text-xs mb-1">Tenure</p>
                                                <p className="text-white font-bold">{loan.tenure} Months</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate('/emi-schedule')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all"
                                            >
                                                View EMI Schedule
                                            </button>
                                            <button
                                                onClick={() => navigate(`/pay-emi/${loan._id}`)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
                                            >
                                                Make Payment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loans.filter(l => l.status === 'rejected').map(loan => (
                            <div key={loan._id} className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-md">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-500/20 rounded-xl">
                                        <FiAlertCircle className="text-red-400" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-red-400 font-bold text-lg mb-1">
                                            Loan Application Update
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-2">
                                            Your <span className="font-semibold capitalize">{loan.reason}</span> loan application has been reviewed.
                                        </p>
                                        {loan.adminRemarks && (
                                            <div className="bg-gray-900/40 p-3 rounded-xl mb-3">
                                                <p className="text-gray-500 text-xs mb-1">Admin Remarks:</p>
                                                <p className="text-gray-300 text-sm italic">"{loan.adminRemarks}"</p>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => navigate('/apply-loan')}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all"
                                        >
                                            Apply for New Loan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatusCard
                        title="Total Applications"
                        value={stats.totalApplied}
                        icon={FiFileText}
                        color="blue"
                    />
                    <StatusCard
                        title="Active Loans"
                        value={stats.activeLoans}
                        icon={FiClock}
                        color="green"
                    />
                    <StatusCard
                        title="Pending Approvals"
                        value={stats.pendingApprovals}
                        icon={FiAlertCircle}
                        color="yellow"
                    />
                    <StatusCard
                        title="Next EMI Due"
                        value={`৳${stats.nextEmiAmount}`}
                        icon={FiCreditCard}
                        color="purple"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Loan Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FiPieChart className="text-blue-400" /> Recent Applications
                                </h2>
                                <button
                                    onClick={() => navigate('/loan-status')}
                                    className="text-blue-400 text-sm hover:underline"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Loan Type</th>
                                            <th className="px-6 py-4 font-medium">Amount</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {loans.map((loan) => (
                                            <tr key={loan._id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 font-medium capitalize">{loan.reason}</td>
                                                <td className="px-6 py-4">৳{loan.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${loan.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        loan.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {loan.status}
                                                    </span>
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-blue-400 hover:text-blue-300 cursor-pointer"
                                                    onClick={() => navigate('/loan-status')}
                                                >
                                                    Details
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* EMI Sidebar */}
                    <div className="space-y-6">
                        <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <FiCreditCard size={80} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-indigo-100 text-sm font-medium">Upcoming EMI</h3>
                                <p className="text-white text-3xl font-bold mt-2">৳{stats.nextEmiAmount}</p>
                                <div className="mt-4 flex items-center gap-2 text-indigo-100/80 text-sm">
                                    <FiClock /> Due Date: {stats.nextEmiDate}
                                </div>
                                <button
                                    onClick={() => activeLoan ? navigate(`/pay-emi/${activeLoan._id}`) : navigate('/emi-schedule')}
                                    className="w-full mt-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </section>

                        <section className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <FiUser className="text-blue-400" /> Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/apply-loan')}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700/50 transition-colors text-sm border border-gray-700 text-left"
                                >
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <FiFileText />
                                    </div>
                                    Apply New Loan
                                </button>
                                <button
                                    onClick={() => navigate('/payment-history')}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700/50 transition-colors text-sm border border-gray-700"
                                >
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                        <FiCreditCard />
                                    </div>
                                    Payment History
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
