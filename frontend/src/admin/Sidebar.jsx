import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaNewspaper, FaImages, FaHandshake, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
        { name: 'CMS Accueil', icon: <FaNewspaper />, path: '/admin/home-page' },
        { name: 'Actualités', icon: <FaNewspaper />, path: '/admin/news' },
        { name: 'Joueurs', icon: <FaUsers />, path: '/admin/players' },
        { name: 'Calendrier', icon: <FaCalendarAlt />, path: '/admin/matches' },
        { name: 'CMS Contact', icon: <FaUsers />, path: '/admin/contact-page' },
        { name: 'CMS Tickets', icon: <FaNewspaper />, path: '/admin/tickets-page' },
        { name: 'Sponsors', icon: <FaHandshake />, path: '/admin/sponsors' },
        { name: 'Galerie', icon: <FaImages />, path: '/admin/gallery' },
        { name: 'Paramètres', icon: <FaCog />, path: '/admin/settings' },
    ];

    return (
        <div className="w-64 min-h-screen bg-card-bg border-r border-white/5 p-6 flex flex-col fixed left-0 top-0">
            <div className="flex items-center space-x-3 mb-12">
                <img src="/images/logo.png" alt="Logo" className="h-10" />
                <span className="text-white font-black italic text-lg leading-tight">LK ADMIN</span>
            </div>

            <nav className="flex-grow space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-4 px-4 py-3 rounded-lg font-bold text-sm transition-all ${location.pathname === item.path ? 'bg-primary-blue text-white shadow-lg shadow-primary-blue/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <button
                onClick={logout}
                className="flex items-center space-x-4 px-4 py-3 rounded-lg font-bold text-sm text-red-500 hover:bg-red-500/10 transition-all mt-auto"
            >
                <FaSignOutAlt className="text-lg" />
                <span>Déconnexion</span>
            </button>
        </div>
    );
};

export default Sidebar;
