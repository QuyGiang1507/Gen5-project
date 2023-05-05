import { Outlet, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import React from 'react';

export default function AdminRoute() {
    const { isAuthenticated, user } = useAuth()
    const location = useLocation();
    
    if (!isAuthenticated) {
        return <Navigate to={`/login?returnUrl=${location.pathname}`}  />
    } else if (user.role !== 'admin') {
        return <Navigate to={`/login?returnUrl=${location.pathname}`}  />
    } else {
        return <Outlet />
    }

}