import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    FiDollarSign,
    FiCalendar,
    FiPercent,
    FiTarget,
    FiUploadCloud,
    FiInfo,
    FiCheckCircle,
    FiArrowLeft
} from 'react-icons/fi';

const ApplyLoan = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        amount: '',
        tenure: '12',
        purpose: 'Personal',
        documents: null
    });
    const [emi, setEmi] = useState(0);
    const [interestRate] = useState(12); // Fixed 12% interest rate
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Calculate EMI whenever amount or tenure changes
    useEffect(() => {
        const principal = parseFloat(formData.amount);
        const months = parseInt(formData.tenure);

        if (principal > 0 && months > 0) {
            const monthlyRate = interestRate / (12 * 100);
            const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            setEmi(Math.round(emiValue));
        } else {
            setEmi(0);
        }
    }, [formData.amount, formData.tenure, interestRate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, documents: file }));

        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }
    };

    const uploadToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image to ImgBB');
        }

        const data = await response.json();
        return data.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.documents) {
                throw new Error("Please upload a document.");
            }

            // Upload to ImgBB
            const imageUrl = await uploadToImgBB(formData.documents);
            console.log("Image uploaded to ImgBB:", imageUrl);

            // const token = await currentUser.getIdToken();
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/loans/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: formData.amount,
                    tenure: formData.tenure,
                    reason: formData.purpose,
                    documents: [imageUrl] // Send array of URLs
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Failed to submit loan application');
            }

            const data = await response.json();
            console.log('Loan Application Submitted:', data);
            setSuccess(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);

        } catch (error) {
            console.error('Error submitting application:', error);
            alert(`Failed to submit application: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl max-w-md w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center animate-bounce">
                            <FiCheckCircle size={48} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold">Application Submitted!</h2>
                    <p className="text-gray-400">
                        Your loan application for ৳{parseInt(formData.amount).toLocaleString()} has been received successfully.
                        Our team will review it and get back to you soon.
                    </p>
                    <div className="pt-4">
                        <p className="text-sm text-blue-400">Redirecting to dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 mt-24 max-w-4xl">
                {/* Header Actions */}
                <div className="mb-8 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <FiArrowLeft /> Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-6 md:p-8">
                            <h1 className="text-3xl font-bold mb-2">Apply for a Loan</h1>
                            <p className="text-gray-400 mb-8">Fill in the details below to start your application process.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Loan Amount */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <FiDollarSign className="text-blue-400" /> Loan Amount (৳)
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        required
                                        min="10000"
                                        max="5000000"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="e.g. 50000"
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white"
                                    />
                                    <p className="text-xs text-gray-500">Min: ৳10,000 | Max: ৳50,00,000</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tenure */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <FiCalendar className="text-blue-400" /> Tenure (Months)
                                        </label>
                                        <select
                                            name="tenure"
                                            value={formData.tenure}
                                            onChange={handleChange}
                                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white appearance-none"
                                        >
                                            <option value="6">6 Months</option>
                                            <option value="12">12 Months</option>
                                            <option value="24">24 Months</option>
                                            <option value="36">36 Months</option>
                                            <option value="48">48 Months</option>
                                            <option value="60">60 Months</option>
                                        </select>
                                    </div>

                                    {/* Interest Rate */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                            <FiPercent className="text-blue-400" /> Interest Rate (Fixed)
                                        </label>
                                        <div className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-400 flex justify-between items-center">
                                            <span>{interestRate}% per annum</span>
                                            <FiInfo className="cursor-help" title="Fixed interest rate for all applicants" />
                                        </div>
                                    </div>
                                </div>

                                {/* Purpose of Loan */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <FiTarget className="text-blue-400" /> Purpose of Loan
                                    </label>
                                    <select
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white appearance-none"
                                    >
                                        <option value="Personal">Personal Expenses</option>
                                        <option value="Education">Education</option>
                                        <option value="Medical">Medical Emergency</option>
                                        <option value="Business">Business Expansion</option>
                                        <option value="Home">Home Improvement</option>
                                        <option value="Vehicle">Vehicle Purchase</option>
                                    </select>
                                </div>

                                {/* Document Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <FiUploadCloud className="text-blue-400" /> Document Upload
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            accept=".pdf,.doc,.docx,image/*"
                                        />
                                        <div className="w-full bg-gray-900/30 border-2 border-dashed border-gray-700 rounded-xl p-8 text-center group-hover:border-blue-500/50 transition-colors">
                                            {previewUrl ? (
                                                <div className="relative inline-block">
                                                    <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-lg mx-auto mb-2" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setFormData(prev => ({ ...prev, documents: null }));
                                                            setPreviewUrl(null);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-20"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                    <p className="text-sm text-green-400 truncate max-w-xs mx-auto">{formData.documents?.name}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <FiUploadCloud className="mx-auto text-gray-500 group-hover:text-blue-400 mb-2" size={32} />
                                                    <p className="text-gray-400">
                                                        Click or drag files to upload ID proof & Pay slips
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-2">Max size: 5MB (PDF, JPG, PNG)</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] ${loading
                                        ? 'bg-gray-700 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Application...
                                        </span>
                                    ) : 'Submit Loan Application'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Summary / EMI Calculator Section */}
                    <div className="space-y-6">
                        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl sticky top-28">
                            <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-4">Loan Estimate</h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-white/60 text-xs">Monthly EMI</p>
                                    <p className="text-white text-4xl font-bold">৳{emi.toLocaleString()}</p>
                                </div>

                                <div className="h-px bg-white/20 my-4" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-white/60 text-xs">Total Principal</p>
                                        <p className="text-white font-semibold">৳{formData.amount ? parseInt(formData.amount).toLocaleString() : '0'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs">Tenure</p>
                                        <p className="text-white font-semibold">{formData.tenure} Months</p>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-4 mt-4">
                                    <div className="flex items-start gap-3">
                                        <FiInfo className="text-blue-200 mt-1" />
                                        <p className="text-xs text-blue-100 leading-relaxed">
                                            This is an estimated EMI based on a fixed {interestRate}% interest rate. Final approval is subject to document verification.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-6">
                            <h3 className="font-semibold mb-4 text-blue-400">Application Checklist</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 shrink-0" /> Minimum 21 years old
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 shrink-0" /> Valid Identity Proof (Aadhar/PAN)
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 shrink-0" /> Last 3 months payslips
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiCheckCircle className="text-green-500 shrink-0" /> Bank account statement
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ApplyLoan;
