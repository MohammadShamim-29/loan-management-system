import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiDollarSign, FiCalendar, FiUser, FiAlertCircle, FiDownload } from 'react-icons/fi';
import AdminSidebar from '../components/AdminSidebar';

const PaymentList = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/payments/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError('Failed to load payments');
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment =>
        (payment.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payment.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex min-h-screen bg-gray-50 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Payment Overview</h1>
                        <p className="text-gray-600">Track and manage all loan repayments</p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-semibold shadow-sm">
                        Total Collected: ৳{payments.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                        <div className="flex items-center">
                            <FiAlertCircle className="text-red-400 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by user or transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No payments found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{payment.userId?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{payment.userId?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ৳{payment.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="text-gray-400" />
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                                {payment._id}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentList;
