import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import {
    FiCreditCard,
    FiShield,
    FiCheckCircle,
    FiArrowLeft,
    FiSmartphone,
    FiGlobe,
    FiAlertCircle,
    FiLoader
} from 'react-icons/fi';

// Initialize Stripe with Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EMIPayment = () => {
    const { loanId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [clientSecret, setClientSecret] = useState('');
    const [paymentData, setPaymentData] = useState({
        paymentId: ''
    });

    const nextEMI = loan?.emiSchedule?.find(emi => emi.status === 'pending');

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/loans`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch loan details');

                const data = await response.json();
                const currentLoan = data.find(l => l._id === loanId);

                if (!currentLoan) throw new Error('Loan not found');

                setLoan(currentLoan);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (loanId) {
            fetchLoanDetails();
        }
    }, [loanId]);

    // Fetch Client Secret when nextEMI is available
    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/payments/create-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount: nextEMI.amount
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    setClientSecret(data.clientSecret);
                } else {
                    throw new Error(data.message || 'Failed to initialize payment');
                }
            } catch (err) {
                console.error('Error fetching client secret:', err);
                setError(err.message);
            }
        };

        if (nextEMI && paymentMethod === 'card' && !clientSecret) {
            fetchClientSecret();
        }
    }, [nextEMI, paymentMethod, clientSecret]);

    const handlePaymentSuccess = async (paymentId) => {
        setSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/payments/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    loanId: loan._id,
                    amount: nextEMI.amount,
                    paymentId: paymentId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Payment recording failed');
            }

            setPaymentData({ paymentId: paymentId });
            setPaymentSuccess(true);
            setSubmitting(false);
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Preparing secure checkout...</p>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 p-8 md:p-12 rounded-[2.5rem] text-center max-w-lg w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-green-500/5">
                            <FiCheckCircle className="text-green-500" size={48} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Your EMI payment for <span className="text-white font-semibold">{loan.reason} Loan</span> has been processed successfully.
                        </p>

                        <div className="bg-gray-900/50 rounded-2xl p-6 mb-8 text-left border border-gray-700/50">
                            <div className="flex justify-between mb-3">
                                <span className="text-gray-500 text-sm">Payment ID</span>
                                <span className="text-xs text-blue-400 font-mono break-all pl-4">{paymentData.paymentId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm">Amount Paid</span>
                                <span className="text-green-400 font-bold">৳{nextEMI?.amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/emi-schedule')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
                        >
                            Back to Schedule
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#4f46e5',
            colorBackground: '#1e293b',
            colorText: '#f8fafc',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '12px',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-12 mt-16 max-w-4xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <FiArrowLeft /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Payment Form */}
                    <div className="lg:col-span-3 space-y-8">
                        <section>
                            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
                            <p className="text-gray-400">Complete your payment using your preferred method.</p>
                        </section>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Select Payment Method</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('card')}
                                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-blue-600/10 border-blue-500 ring-2 ring-blue-500/20' : 'bg-gray-800/40 border-gray-700 hover:border-gray-600'}`}
                                >
                                    <div className={`p-3 rounded-xl ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                        <FiCreditCard size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold">Credit / Debit Card</p>
                                        <p className="text-xs text-gray-500">Stripe Secure Payment</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-400">
                                <FiAlertCircle />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {paymentMethod === 'card' && clientSecret ? (
                            <Elements stripe={stripePromise} options={options}>
                                <CheckoutForm amount={nextEMI?.amount || 0} onPaymentSuccess={handlePaymentSuccess} />
                            </Elements>
                        ) : paymentMethod === 'card' && !error ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-gray-800/40 rounded-3xl border border-gray-700 animate-pulse">
                                <FiLoader className="animate-spin text-blue-500 mb-4" size={32} />
                                <p className="text-gray-400 text-sm">Initializing Stripe...</p>
                            </div>
                        ) : (
                            <div className="bg-gray-800/40 border border-dashed border-gray-700 p-8 rounded-3xl text-center">
                                <FiAlertCircle className="mx-auto text-gray-500 mb-4" size={32} />
                                <p className="text-gray-400">Only Card Payment is available via Stripe at this moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-3xl p-8 sticky top-32">
                            <h2 className="text-xl font-bold mb-6">Payment Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Loan Type</span>
                                    <span className="font-medium">{loan.reason} Loan</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">EMI No.</span>
                                    <span className="font-medium">{nextEMI?.month} of {loan.tenure}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-400">Due Date</span>
                                    <span className="font-medium">{new Date(nextEMI?.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="border-t border-gray-700 my-4 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold">Total Amount</span>
                                    <span className="text-2xl font-black text-blue-400">৳{nextEMI?.amount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                                <div className="flex gap-3 text-blue-400">
                                    <FiShield className="flex-shrink-0 mt-1" />
                                    <p className="text-xs leading-relaxed text-blue-200/70">
                                        Your payment information is encrypted and processed via Stripe. We do not store your card details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EMIPayment;
