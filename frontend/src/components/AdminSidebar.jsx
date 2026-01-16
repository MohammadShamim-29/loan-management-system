import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, History, LogOut, Users, DollarSign } from 'lucide-react';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin-login');
    };

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getButtonClass = (path) => {
        const baseClass = "flex items-center space-x-3 w-full p-3 rounded-lg transition-colors";
        const activeClass = "bg-blue-50 text-blue-600";
        const inactiveClass = "text-gray-600 hover:bg-gray-100";

        return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
    };

    return (
        <aside className="w-64 bg-white shadow-lg hidden md:block border-r border-gray-100 flex-shrink-0 h-screen sticky top-0">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <nav className="p-4 space-y-2">
                <button onClick={() => navigate('/admin-dashboard')} className={getButtonClass('/admin-dashboard')}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </button>
                <button onClick={() => navigate('/admin/all-loans')} className={getButtonClass('/admin/all-loans')}>
                    <ClipboardList size={20} />
                    <span>All Loans</span>
                </button>
                <button onClick={() => navigate('/admin/loans')} className={getButtonClass('/admin/loans')}>
                    <History size={20} />
                    <span>Pending Approvals</span>
                </button>
                <button onClick={() => navigate('/admin/users')} className={getButtonClass('/admin/users')}>
                    <Users size={20} />
                    <span>Users</span>
                </button>
                <button onClick={() => navigate('/admin/payments')} className={getButtonClass('/admin/payments')}>
                    <DollarSign size={20} />
                    <span>Payments</span>
                </button>
                <div className="pt-8 mt-8 border-t">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
