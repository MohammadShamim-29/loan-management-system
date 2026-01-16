import React from 'react';

const features = [
    {
        title: 'Quick Approval',
        description: 'Get your loan application reviewed and approved in as little as 24 hours with our automated system.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: 'bg-blue-100 text-blue-600',
    },
    {
        title: 'Flexible EMI Plans',
        description: 'Choose from a variety of monthly installment plans that fit your budget and financial goals.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        color: 'bg-green-100 text-green-600',
    },
    {
        title: 'Low Interest Rates',
        description: 'Competitive interest rates starting at just 8.5% APR, ensuring you save more over time.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        color: 'bg-indigo-100 text-indigo-600',
    },
    {
        title: 'Minimal Paperwork',
        description: 'Experience a 100% digital application process with no physical visits or bulky documents.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        color: 'bg-purple-100 text-purple-600',
    },
    {
        title: 'Transparent Process',
        description: 'Track your application status in real-time and stay informed at every step of the way.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
        color: 'bg-orange-100 text-orange-600',
    },
    {
        title: 'Hassle-free Payments',
        description: 'Automated EMI deductions and multiple payment modes for your convenience and peace of mind.',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        color: 'bg-pink-100 text-pink-600',
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm">Why Choose Us</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Everything you need for smart financing
                    </p>
                    <p className="mt-4 text-xl text-gray-500">
                        We provide a comprehensive platform to manage your loans from application to final payment with ease.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="relative group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100"
                            >
                                <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.color} mb-8 transition-transform group-hover:scale-110 duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
