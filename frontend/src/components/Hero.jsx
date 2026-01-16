import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-300 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                            <span className="block xl:inline">Smart Loans for</span>{' '}
                            <span className="block text-indigo-600 xl:inline">Your Bright Future</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-500 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
                            Experience seamless financing with FinEase. Quick approvals, low interest rates, and flexible repayment plans tailored specifically for your needs. Apply in minutes and get funded today.
                        </p>
                        <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                to="/register"
                                className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-1 md:text-lg md:px-10"
                            >
                                Start Application
                            </Link>
                            <a
                                href="#features"
                                className="flex items-center justify-center px-8 py-4 border-2 border-indigo-100 text-base font-bold rounded-2xl text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 md:text-lg md:px-10"
                            >
                                View Features
                            </a>
                        </div>

                        {/* Social proof/Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8 sm:justify-center lg:justify-start">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">10k+</p>
                                <p className="text-sm text-gray-500">Happy Users</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">24/7</p>
                                <p className="text-sm text-gray-500">Support</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">99%</p>
                                <p className="text-sm text-gray-500">Approval Rate</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 relative">
                        <div className="bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-3xl p-4 transform lg:rotate-3 transition-transform hover:rotate-0 duration-500 shadow-2xl overflow-hidden">
                            {/* Mockup or Illustration Placeholder */}
                            <div className="aspect-[4/3] bg-white rounded-2xl shadow-inner flex flex-col items-center justify-center text-center p-8 border border-white">
                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 8V7m0 1v1m0 0a4 4 0 110 8m0 0v1m0-1c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Loan Approved</h3>
                                <p className="text-gray-500">Your application for $15,000 has been successfully approved.</p>
                                <div className="mt-8 w-full bg-gray-50 rounded-xl h-2 relative">
                                    <div className="absolute left-0 top-0 h-full bg-green-500 rounded-xl w-3/4"></div>
                                </div>
                                <div className="mt-2 flex justify-between w-full text-xs font-semibold text-gray-400">
                                    <span>Processing</span>
                                    <span className="text-green-600 font-bold">Approved</span>
                                </div>
                            </div>
                        </div>
                        {/* Floating floating elements */}
                        <div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-4 border border-gray-100 animate-bounce group transform hover:scale-105 transition-transform">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Fast Funding</p>
                                <p className="text-xs text-gray-500">Within 24 Hours</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
