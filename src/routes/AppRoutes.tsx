import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Calculator from '../pages/Calculator';
import Login from '../pages/Login';
import { AUTH_TOKEN_KEY } from '../constants/accounts';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

const AppRoutes: React.FC = () => {
  const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/tinh-gia-shopee" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
          <Route path="/shopee-price-calculator" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
          <Route path="/dang-nhap" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;