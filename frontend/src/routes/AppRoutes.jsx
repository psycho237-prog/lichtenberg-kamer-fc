import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Team from '../pages/Team/Team';
import Matches from '../pages/Matches/Matches';
import NewsList from '../pages/News/NewsList';
import NewsDetail from '../pages/News/NewsDetail';
import Gallery from '../pages/Gallery/Gallery';
import Contact from '../pages/Contact/Contact';
import TopScorers from '../pages/TopScorers/TopScorers';

// Admin components
import AdminLogin from '../admin/Login';
import Dashboard from '../admin/Dashboard';
import AdminPlayers from '../admin/AdminPlayers';
import AdminNews from '../admin/AdminNews';
import AdminMatches from '../admin/AdminMatches';
import AdminGallery from '../admin/AdminGallery';
import AdminHome from '../admin/AdminHome';
import AdminSponsors from '../admin/AdminSponsors';
import AdminContact from '../admin/AdminContact';
import AdminSettings from '../admin/AdminSettings';
import AdminPlayerStats from '../admin/AdminPlayerStats';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/lkev-admin/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Team />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/stats" element={<TopScorers />} />

            {/* Admin Routes */}
            <Route path="/lkev-admin/login" element={<AdminLogin />} />
            <Route path="/lkev-admin/dashboard" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/players" element={
                <PrivateRoute>
                    <AdminPlayers />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/stats" element={
                <PrivateRoute>
                    <AdminPlayerStats />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/news" element={
                <PrivateRoute>
                    <AdminNews />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/matches" element={
                <PrivateRoute>
                    <AdminMatches />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/gallery" element={
                <PrivateRoute>
                    <AdminGallery />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/home-page" element={
                <PrivateRoute>
                    <AdminHome />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/contact-page" element={
                <PrivateRoute>
                    <AdminContact />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/sponsors" element={
                <PrivateRoute>
                    <AdminSponsors />
                </PrivateRoute>
            } />
            <Route path="/lkev-admin/settings" element={
                <PrivateRoute>
                    <AdminSettings />
                </PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
        </Routes>
    );
};

export default AppRoutes;
