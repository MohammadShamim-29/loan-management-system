import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 px-4 sm:px-0">
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                                FinEase
                            </span>
                        </Link>
                        <p className="text-gray-500 mb-6 max-w-xs transition-colors hover:text-gray-600">
                            Making financial freedom accessible for everyone through technology-driven lending solutions.
                        </p>
                        <div className="flex space-x-4">
                            {/* Simple Social Icons */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase text-sm tracking-widest">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-500 hover:text-indigo-600 transition-colors">Home</Link></li>
                            <li><a href="#about" className="text-gray-500 hover:text-indigo-600 transition-colors">About Us</a></li>
                            <li><a href="#features" className="text-gray-500 hover:text-indigo-600 transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase text-sm tracking-widest">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 uppercase text-sm tracking-widest">Newsletter</h4>
                        <p className="text-gray-500 mb-4 transition-colors hover:text-gray-600">
                            Subscribe to get the latest news and offers.
                        </p>
                        <form className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 px-4 py-2 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 FinEase. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="flex items-center space-x-1 cursor-default hover:text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path d="M12 11h.01M12 7h.01M12 15h.01" /></svg>
                            <span>Built with React & Tailwind</span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
