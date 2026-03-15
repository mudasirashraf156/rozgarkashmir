import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkersPage from './pages/WorkersPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import ProfilePage from './pages/ProfilePage';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #E5E0D5', borderTopColor: '#FF6B00', borderRadius: '50%' }} />
    </div>
  );
  if (!user) return <Navigate to="/admin/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      {/* Hide navbar on admin login page */}
      {!(window.location.pathname === '/admin/login') && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/workers/:id" element={<WorkerDetailPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
