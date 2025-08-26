import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Calculator from '../pages/Calculator';
// import Login from '../pages/Login';
// import OTPVerification from '../pages/OTPVerification';
// import { AUTH_TOKEN_KEY } from '../constants/accounts';

// Tạm thời comment out ProtectedRoute
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

//   return isAuthenticated ? <>{children}</> : null;
// };

const AppRoutes: React.FC = () => {
  // const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY);

  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Tạm thời comment out các route đăng nhập */}
          {/* <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } /> */}
          <Route path="/" element={
            // <ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          } />
          <Route path="/tinh-gia-shopee" element={
            // <ProtectedRoute>
              <Calculator />
            // </ProtectedRoute>
          } />
          <Route path="/shopee-price-calculator" element={
            // <ProtectedRoute>
              <Calculator />
            // </ProtectedRoute>
          } />
          {/* <Route path="/dang-nhap" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } /> */}
          {/* <Route path="/otp-verification" element={<OTPVerification />} /> */}
          {/* <Route path="/xac-thuc-otp" element={<OTPVerification />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;