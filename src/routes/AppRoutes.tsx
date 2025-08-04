import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Calculator from '../pages/Calculator';
import Login from '../pages/Login';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tinh-gia-shopee" element={<Calculator />} />
          <Route path="/shopee-price-calculator" element={<Calculator />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dang-nhap" element={<Login />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes; 