import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';
import useAuth from '../../hooks/useAuth';

export default function GuestRoute() {
  const { user } = useAuth();

  if (user) return <Navigate to={'/'} replace />

  return <Outlet />
}