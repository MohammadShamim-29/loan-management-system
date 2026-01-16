import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const userJson = localStorage.getItem('user');
    let user = null;
    try {
        if (userJson && userJson !== "undefined") {
            user = JSON.parse(userJson);
        }
    } catch (e) {
        console.error("Error parsing user from localStorage:", e);
    }
    const role = user?.role || 'user'; // Default to user if not found/specified (adjust as needed)

    // 1. Check if user is logged in (Firebase state OR localStorage token)
    if (!currentUser && !localStorage.getItem('token')) {
        return <Navigate to="/login" />;
    }

    // 2. Check Role permissions (if allowedRoles is provided)
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard based on their ACTUAL role
        if (role === 'admin') {
            return <Navigate to="/admin-dashboard" />;
        } else {
            return <Navigate to="/dashboard" />;
        }
    }

    return children;
};

export default ProtectedRoute;
