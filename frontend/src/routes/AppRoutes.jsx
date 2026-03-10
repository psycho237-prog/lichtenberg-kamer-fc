import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Team from '../pages/Team/Team';
import Matches from '../pages/Matches/Matches';
import Contact from '../pages/Contact/Contact';
// Admin components would go here too
import AdminLogin from '../admin/Login';
import Dashboard from '../admin/Dashboard';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/admin/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
