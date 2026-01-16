import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFileText, FiClock, FiCheckCircle, FiXCircle, FiFilter, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/loans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching loans:', err);
            setError('Failed to load loan applications');
            setLoading(false);
        }
    };

    const filteredLoans = loans.filter(loan => {
        const matchesSearch =
            (loan.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loan.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            loan.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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
                        <h1 className="text-3xl font-bold text-gray-900">All Loan Applications</h1>
                        <p className="text-gray-600">Comprehensive history of all loan requests</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Stats could go here */}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by applicant or loan purpose..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                            <FiFilter className="text-gray-400" />
                            {['all', 'pending', 'approved', 'rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${statusFilter === status
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Applicant</th>
                                    <th className="px-6 py-4 font-medium">Loan Details</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Applied Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No loans found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLoans.map((loan) => (
                                        <tr key={loan._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{loan.userId?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{loan.userId?.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="capitalize text-gray-900 font-medium">{loan.reason}</span>
                                                    <span className="text-xs text-gray-500">{loan.tenure} Months Tenure</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ৳{loan.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(loan.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${loan.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        loan.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                            'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {loan.status === 'approved' && <FiCheckCircle className="mr-1" />}
                                                    {loan.status === 'pending' && <FiClock className="mr-1" />}
                                                    {loan.status === 'rejected' && <FiXCircle className="mr-1" />}
                                                    <span className="capitalize">{loan.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {loan.status === 'pending' ? (
                                                    <button
                                                        onClick={() => navigate('/admin/loans')}
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-200 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                                                    >
                                                        Review
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">Completed</span>
                                                )}
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

export default LoanList;
