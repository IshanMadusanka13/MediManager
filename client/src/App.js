import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffManagePage from './pages/ManageStaff/StaffManagePage';
import StaffSchedulePage from './pages/ManageStaff/StaffSchedulePage';
import ReportPage from './pages/ManageStaff/ReportPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DigitleHeathCard from './pages/digitalCard/DigitleHeathCard';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff" element={<StaffManagePage />} />
        <Route path="/schedules" element={<StaffSchedulePage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/digitleHeathCard" element={<DigitleHeathCard />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;