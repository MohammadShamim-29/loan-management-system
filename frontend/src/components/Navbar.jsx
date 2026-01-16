import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, ChevronDown, Settings } from 'lucide-react';
import { FiHash, FiCalendar } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const profileRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">L</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                                FinEase
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Home</Link>
                        <a href="/#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
                        <a href="/#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</a>
                        {currentUser && (() => {
                            let role = 'user';
                            try {
                                const userJson = localStorage.getItem('user');
                                if (userJson && userJson !== "undefined") {
                                    role = JSON.parse(userJson).role;
                                }
                            } catch (error) {
                                console.error("Error parsing user data:", error);
                            }

                            if (role === 'admin') {
                                return (
                                    <>
                                        <Link to="/admin-dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Admin Dashboard</Link>
                                    </>
                                );
                            } else {
                                // Default for 'user' and 'customer'
                                return (
                                    <>
                                        <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Dashboard</Link>
                                        <Link to="/loan-status" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Loan Status</Link>
                                        <Link to="/emi-schedule" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">EMI Schedule</Link>
                                    </>
                                );
                            }
                        })()}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!currentUser ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 rounded-full text-indigo-600 font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                                >
                                    {currentUser.photoURL ? (
                                        <img
                                            src={currentUser.photoURL}
                                            alt={currentUser.displayName}
                                            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-300"
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-indigo-100 group-hover:border-indigo-300">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className="flex flex-col items-start hidden lg:flex">
                                        <span className="text-sm font-bold text-gray-900 leading-none">
                                            {currentUser.displayName || 'User'}
                                        </span>
                                        <span className="text-xs text-gray-500">Account</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-sm font-semibold text-gray-900">{currentUser.displayName}</p>
                                            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                        </div>
                                        {(() => {
                                            const userJson = localStorage.getItem('user');
                                            const role = userJson ? JSON.parse(userJson).role : 'user';
                                            return role === 'admin' ? (
                                                <Link to="/admin-dashboard" className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                                                    Admin Dashboard
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link to="/profile" className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                                                        Profile Settings
                                                    </Link>
                                                    <Link to="/dashboard" className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                                                        Dashboard
                                                    </Link>
                                                    <Link to="/loan-status" className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        <FiHash className="w-4 h-4 mr-3 text-gray-400" />
                                                        Loan Status
                                                    </Link>
                                                    <Link to="/emi-schedule" className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        <FiCalendar className="w-4 h-4 mr-3 text-gray-400" />
                                                        EMI Schedule
                                                    </Link>
                                                </>
                                            );
                                        })()}
                                        <div className="h-px bg-gray-50 my-1 mx-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white border-b border-gray-100`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Home</Link>
                    <a href="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Features</a>
                    <a href="/#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">About</a>
                    {currentUser && (
                        <>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Dashboard</Link>
                            <Link to="/loan-status" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Loan Status</Link>
                            <Link to="/emi-schedule" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">EMI Schedule</Link>
                        </>
                    )}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    {!currentUser ? (
                        <div className="flex flex-col space-y-2 px-5">
                            <Link to="/login" className="text-center w-full px-4 py-2 rounded-md font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50">Login</Link>
                            <Link to="/register" className="text-center w-full px-4 py-2 rounded-md font-medium bg-indigo-600 text-white hover:bg-indigo-700">Get Started</Link>
                        </div>
                    ) : (
                        <div className="px-5 space-y-3">
                            <div className="flex items-center space-x-3 mb-2">
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{currentUser.displayName}</p>
                                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2 rounded-md font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
