import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Joueurs Total', value: '0', color: 'blue' },
        { label: 'Articles Publiés', value: '0', color: 'green' },
        { label: 'Matchs Calendrier', value: '0', color: 'yellow' },
        { label: 'Photos / Vidéos', value: '0', color: 'purple' },
    ]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const [players, news, matches, gallery] = await Promise.all([
                axios.get('http://localhost:5000/api/players'),
                axios.get('http://localhost:5000/api/news'),
                axios.get('http://localhost:5000/api/matches'),
                axios.get('http://localhost:5000/api/gallery')
            ]);

            setStats([
                { label: 'Joueurs Total', value: players.data.length, color: 'blue' },
                { label: 'Articles Publiés', value: news.data.length, color: 'green' },
                { label: 'Matchs Calendrier', value: matches.data.length, color: 'yellow' },
                { label: 'Photos / Vidéos', value: gallery.data.length, color: 'purple' },
            ]);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic tracking-tighter">Tableau de Bord</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer Lichtenberg-Kamer FC</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="card-gradient rounded-3xl p-8 border border-white/5 hover:border-primary-blue/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-1 bg-primary-blue rounded-full`}></div>
                            </div>
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">{stat.label}</h3>
                            <div className="text-4xl font-black italic text-white flex items-baseline">
                                {loading ? '...' : stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-gradient rounded-3xl p-10 border border-white/5">
                        <h3 className="text-2xl font-black italic text-white uppercase italic mb-6">Actions Rapides</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/admin/news" className="bg-white/5 hover:bg-primary-blue p-6 rounded-2xl transition-colors text-center group">
                                <span className="font-bold uppercase text-[10px] tracking-widest text-gray-400 group-hover:text-white">Publier Actuality</span>
                            </Link>
                            <Link to="/admin/players" className="bg-white/5 hover:bg-primary-blue p-6 rounded-2xl transition-colors text-center group">
                                <span className="font-bold uppercase text-[10px] tracking-widest text-gray-400 group-hover:text-white">Gestion Joueurs</span>
                            </Link>
                            <Link to="/admin/matches" className="bg-white/5 hover:bg-primary-blue p-6 rounded-2xl transition-colors text-center group">
                                <span className="font-bold uppercase text-[10px] tracking-widest text-gray-400 group-hover:text-white">Gérer Matchs</span>
                            </Link>
                            <Link to="/admin/gallery" className="bg-white/5 hover:bg-primary-blue p-6 rounded-2xl transition-colors text-center group">
                                <span className="font-bold uppercase text-[10px] tracking-widest text-gray-400 group-hover:text-white">Média Gallery</span>
                            </Link>
                        </div>
                    </div>

                    <div className="card-gradient rounded-3xl p-10 border border-white/5 flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-1 bg-primary-blue mb-6"></div>
                        <h3 className="text-2xl font-black italic text-white uppercase italic mb-2">Mode CMS Activé</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-xs leading-relaxed">
                            Contenu dynamique : Accueil, Contact, Tickets et Paramètres globaux disponibles via le menu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
