import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FiCheck,
    FiX,
    FiUser,
    FiFileText,
    FiEye,
    FiMessageSquare,
    FiClock,
    FiAlertCircle,
    FiDownload
} from 'react-icons/fi';
import AdminSidebar from '../components/AdminSidebar';

const AdminLoanApproval = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/loans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Show only pending loans by default or all?
            // Requirement says "Loan Approval Page", implying pending ones.
            setLoans(response.data.filter(loan => loan.status === 'pending'));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching loans:', err);
            setError('Failed to load loan applications');
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        if (!remarks && status === 'rejected') {
            alert('Please provide remarks for rejection');
            return;
        }

        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/loans/${id}/status`, {
                status,
                adminRemarks: remarks
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Loan ${status} successfully!`);
            setRemarks('');
            setSelectedLoan(null);
            fetchLoans();
        } catch (err) {
            console.error('Error updating loan status:', err);
            alert('Failed to update loan status');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Loan Approvals</h1>
                        <p className="text-gray-600">Review and process pending loan applications</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold">
                        {loans.length} Pending Applications
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List of Applications */}
                    <div className="lg:col-span-2 space-y-4">
                        {loans.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-dashed border-gray-300">
                                <FiClock className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-semibold text-gray-900">No Pending Applications</h3>
                                <p className="text-gray-500">All caught up! Check back later.</p>
                            </div>
                        ) : (
                            loans.map((loan) => (
                                <div
                                    key={loan._id}
                                    onClick={() => setSelectedLoan(loan)}
                                    className={`bg-white p-6 rounded-2xl shadow-sm border-2 transition-all cursor-pointer ${selectedLoan?._id === loan._id ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                                <FiUser size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{loan.userId?.name || 'Unknown User'}</h3>
                                                <p className="text-sm text-gray-500">{loan.userId?.email || 'No email'}</p>
                                                <div className="mt-2 flex items-center gap-4 text-xs font-medium uppercase tracking-wider">
                                                    <span className="text-gray-400">Amount:</span>
                                                    <span className="text-emerald-600 font-bold">৳{loan.amount.toLocaleString()}</span>
                                                    <span className="text-gray-400">Tenure:</span>
                                                    <span className="text-indigo-600 font-bold">{loan.tenure} mo</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-gray-400 mb-1">Applied on</span>
                                            <span className="text-sm font-medium">{new Date(loan.createdAt).toLocaleDateString()}</span>
                                            <div className="mt-3">
                                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1">
                                                    Review <FiEye />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Review Panel */}
                    <div className="lg:col-span-1">
                        {selectedLoan ? (
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FiFileText className="text-indigo-600" /> Application Details
                                </h2>

                                <div className="space-y-6">
                                    {selectedLoan.adminRemarks && (
                                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Previous Remarks</p>
                                            <p className="text-gray-600 italic">"{selectedLoan.adminRemarks}"</p>
                                        </div>
                                    )}

                                    {/* Document Viewer */}
                                    {selectedLoan.documents && selectedLoan.documents.length > 0 && (
                                        <div className="mb-6">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Attached Documents</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedLoan.documents.map((docUrl, index) => (
                                                    <a key={index} href={docUrl} target="_blank" rel="noopener noreferrer" className="block group relative overflow-hidden rounded-lg border border-gray-200">
                                                        <img src={docUrl} alt={`Document ${index + 1}`} className="w-full h-32 object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <FiEye className="text-white text-xl" />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <p className="text-xs text-gray-500 mb-1">Purpose</p>
                                            <p className="font-bold text-gray-800 capitalize">{selectedLoan.reason}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl">
                                            <p className="text-xs text-gray-500 mb-1">Status</p>
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">Pending</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <FiMessageSquare className="text-indigo-500" /> Decision Remarks
                                        </h4>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Enter approval/rejection notes..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-all"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-xs text-gray-400 mb-2 text-center">
                                            Approving this loan will automatically generate the EMI schedule.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleAction(selectedLoan._id, 'rejected')}
                                                disabled={processing}
                                                className="flex items-center justify-center gap-2 py-4 px-6 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all border border-red-100 disabled:opacity-50"
                                            >
                                                <FiX /> Reject
                                            </button>
                                            <button
                                                onClick={() => handleAction(selectedLoan._id, 'approved')}
                                                disabled={processing}
                                                className="flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                                            >
                                                <FiCheck /> Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center py-20">
                                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <FiEye className="text-indigo-500" size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-indigo-900 mb-2">Select an Application</h3>
                                <p className="text-indigo-600 text-sm">Pick a loan application from the list to review details and take action.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminLoanApproval;
