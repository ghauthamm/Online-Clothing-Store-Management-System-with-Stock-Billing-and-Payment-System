// Protected Route Component - Route guard for authenticated routes
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PageLoader from './PageLoader';

// Protected Route - Requires authentication
export const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <PageLoader />;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// Admin Route - Requires admin role
export const AdminRoute = ({ children }) => {
    const { currentUser, userRole, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <PageLoader />;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
