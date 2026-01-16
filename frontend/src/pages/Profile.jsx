import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Calendar, Shield, Edit3 } from 'lucide-react';

const Profile = () => {
    const { currentUser } = useAuth();

    // Default values if user properties are missing
    const user = {
        name: currentUser?.displayName || 'User',
        email: currentUser?.email || 'N/A',
        photo: currentUser?.photoURL,
        memberSince: currentUser?.metadata?.creationTime
            ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : 'Unknown'
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 mt-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                        <p className="text-gray-500 mt-2">Manage your account information and preferences.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Cover / Header Section */}
                        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                            <div className="absolute -bottom-16 left-8">
                                <div className="p-1.5 bg-white rounded-full">
                                    {user.photo ? (
                                        <img
                                            src={user.photo}
                                            alt={user.name}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 border-4 border-white">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="pt-20 pb-8 px-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                                    <Edit3 size={16} />
                                    Edit Profile
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                {/* Personal Info Card */}
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User size={20} className="text-indigo-500" />
                                        Personal Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                                            <p className="text-gray-900 font-medium">{user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-gray-400" />
                                                <p className="text-gray-900 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Phone</label>
                                            <p className="text-gray-500 italic">Not provided</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Stuff */}
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Shield size={20} className="text-green-500" />
                                        Account Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Member Since</label>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-gray-400" />
                                                <p className="text-gray-900 font-medium">{user.memberSince}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Account Status</label>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">Role</label>
                                            <p className="text-gray-900 font-medium capitalize">User</p>
                                        </div>
                                    </div>
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

export default Profile;
