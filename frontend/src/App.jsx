import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLoan from './pages/ApplyLoan';
import LoanStatus from './pages/LoanStatus';
import EMISchedule from './pages/EMISchedule';
import EMIPayment from './pages/EMIPayment';
import PaymentHistory from './pages/PaymentHistory';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLoanApproval from './pages/AdminLoanApproval';
import UserList from './pages/UserList';
import PaymentList from './pages/PaymentList';
import LoanList from './pages/LoanList';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user', 'customer']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply-loan"
              element={
                <ProtectedRoute allowedRoles={['user', 'customer']}>
                  <ApplyLoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loan-status"
              element={
                <ProtectedRoute allowedRoles={['user', 'customer']}>
                  <LoanStatus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emi-schedule"
              element={
                <ProtectedRoute allowedRoles={['user', 'customer']}>
                  <EMISchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pay-emi/:loanId"
              element={
                <ProtectedRoute allowedRoles={['user', 'customer']}>
                  <EMIPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-history"
              element={
                <ProtectedRoute allowedRoles={['user', 'admin']}>
                  <PaymentHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/loans"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLoanApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PaymentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/all-loans"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <LoanList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

