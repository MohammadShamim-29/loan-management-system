import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import {
    Users,
    FileText,
    CheckCircle,
    Clock,
    DollarSign,
    TrendingUp,
    LogOut,
    LayoutDashboard,
    ClipboardList,
    History
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalApplications: 0,
        approvedLoans: 0,
        pendingLoans: 0,
        totalAmountDisbursed: 0
    });
    const [recentLoans, setRecentLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/loans/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const loansRes = await axios.get('http://localhost:5000/api/loans', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const usersRes = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const paymentsRes = await axios.get('http://localhost:5000/api/payments/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setStats(res.data);
                setRecentLoans(loansRes.data.slice(0, 5));
                setUsers(usersRes.data);
                setRecentPayments(paymentsRes.data.slice(0, 5));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin-login');
    };

    const statsCards = [
        { title: 'Total Applications', value: stats.totalApplications, icon: <FileText className="text-blue-500" />, color: 'bg-blue-50' },
        { title: 'Approved Loans', value: stats.approvedLoans, icon: <CheckCircle className="text-green-500" />, color: 'bg-green-50' },
        { title: 'Pending Loans', value: stats.pendingLoans, icon: <Clock className="text-yellow-500" />, color: 'bg-yellow-50' },
        { title: 'Amount Disbursed', value: `$${stats.totalAmountDisbursed.toLocaleString()}`, icon: <DollarSign className="text-purple-500" />, color: 'bg-purple-50' },
    ];

    const chartData = [
        { name: 'Total', value: stats.totalApplications },
        { name: 'Approved', value: stats.approvedLoans, color: '#10B981' },
        { name: 'Pending', value: stats.pendingLoans, color: '#F59E0B' },
    ];

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
                        <p className="text-gray-500">Welcome back, Administrator</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <Users className="text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statsCards.map((card, index) => (
                        <div key={index} className={`${card.color} p-6 rounded-2xl shadow-sm border border-transparent hover:border-blue-200 transition-all`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    {card.icon}
                                </div>
                                <TrendingUp className="text-gray-300 h-4 w-4" />
                            </div>
                            <h3 className="text-gray-500 font-medium text-sm mb-1">{card.title}</h3>
                            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 font-semibold">Loan Distribution</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 font-semibold">Status Breakdown</h3>
                        <div className="h-64 flex flex-col items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.slice(1)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.slice(1).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 font-semibold">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/admin/loans')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
                        >
                            Review Applications
                        </button>
                        <button
                            onClick={() => navigate('/admin/payments')}
                            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            View Transactions
                        </button>
                    </div>
                </div>

                {/* Recent Applications Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
                        <button
                            onClick={() => navigate('/admin/all-loans')}
                            className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Applicant</th>
                                    <th className="px-6 py-4 font-medium">Loan Type</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No recent applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentLoans.map((loan) => (
                                        <tr key={loan._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{loan.userId?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{loan.userId?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize text-gray-700">{loan.reason}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">৳{loan.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(loan.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${loan.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    loan.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {loan.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => navigate('/admin/loans')}
                                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users and Payments Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

                    {/* User List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Recent Users</h3>
                            <button
                                onClick={() => navigate('/admin/users')}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Email</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.slice(0, 5).map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Overview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Recent Payments</h3>
                            <button
                                onClick={() => navigate('/admin/payments')}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Amount</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No payments found.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentPayments.map((payment) => (
                                            <tr key={payment._id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {payment.userId?.name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    ৳{payment.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
