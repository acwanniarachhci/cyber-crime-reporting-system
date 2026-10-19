import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import BackButton from './components/BackButton';import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';


import Home from './pages/Home';
import ReportScam from './pages/ReportScam';
import TrackCase from './pages/TrackCase';
import Awareness from './pages/Awareness';
import ScamDatabase from './pages/ScamDatabase';
import Login from './pages/Login';
import Register from './pages/Register';
import MyReports from './pages/MyReports';
import AdminDashboard from './pages/AdminDashboard';
import AdminReportDetail from './pages/AdminReportDetail';
import AdminScamDatabase from './pages/AdminScamDatabase';

function App() {
  return (
    <AuthProvider>
      <AnimatedBackground />
      <BrowserRouter>
        <Navbar />
         <BackButton />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportScam />} />
            <Route path="/track" element={<TrackCase />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/database" element={<ScamDatabase />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/my-reports"
              element={
                <ProtectedRoute>
                  <MyReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin', 'investigator']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports/:id"
              element={
                <ProtectedRoute roles={['admin', 'investigator']}>
                  <AdminReportDetail />
                </ProtectedRoute>
              }
            />
                        <Route
              path="/admin/scam-database"
              element={
                <ProtectedRoute roles={['admin', 'investigator']}>
                  <AdminScamDatabase />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;