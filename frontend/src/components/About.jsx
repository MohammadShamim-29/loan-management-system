import React from 'react';

const About = () => {
    return (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="mb-12 lg:mb-0">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            About FinEase
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            We are dedicated to making financial freedom accessible to everyone. Our mission is to provide transparent, quick, and hassle-free loan services.
                        </p>

                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-lg leading-6 font-medium text-gray-900">
                                        Fast & Secure
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-500">
                                        Our platform uses state-of-the-art security to ensure your data is safe while providing lightning-fast loan approvals.
                                    </dd>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <dt className="text-lg leading-6 font-medium text-gray-900">
                                        Customer First
                                    </dt>
                                    <dd className="mt-2 text-base text-gray-500">
                                        We prioritize our customers needs with flexible repayment options and 24/7 support.
                                    </dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                    <div className="relative">
                        <div className="aspect-w-3 aspect-h-2 rounded-2xl overflow-hidden shadow-xl">
                            <img
                                className="object-cover w-full h-full"
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1932&q=80"
                                alt="Team working together"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
