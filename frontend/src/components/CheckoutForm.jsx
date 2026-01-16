import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { FiLock, FiAlertCircle } from 'react-icons/fi';

const CheckoutForm = ({ amount, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL for redirection (if needed, but we handle success below)
                return_url: window.location.origin + "/payment-history",
            },
            redirect: "if_required", // Handle redirection manually if needed
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment success!
            onPaymentSuccess(paymentIntent.id);
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
            </div>

            {message && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                    <FiAlertCircle className="shrink-0" />
                    <span>{message}</span>
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <FiLock />
                        Pay ৳{amount.toLocaleString()}
                    </>
                )}
            </button>
            <p className="text-center text-xs text-gray-400">
                Your payment is secured with 256-bit encryption
            </p>
        </form>
    );
};

export default CheckoutForm;
