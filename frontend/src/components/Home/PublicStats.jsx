import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaFutbol, FaNewspaper, FaUsers, FaTrophy, FaCalendarAlt } from 'react-icons/fa';
import { API_BASE } from '../../services/api';

const PublicStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/stats/public');
                setStats(res.data);
            } catch (err) {
                console.error('Erreur chargement stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) return null;

    const statItems = [
        { label: 'Matchs Joués', value: stats.matchesPlayed, icon: <FaFutbol className="text-primary-blue text-2xl md:text-3xl" /> },
        { label: 'Articles', value: stats.articlesPublished, icon: <FaNewspaper className="text-primary-yellow text-2xl md:text-3xl" /> },
        { label: 'Abonnés', value: stats.subscribers, icon: <FaUsers className="text-white text-2xl md:text-3xl" /> },
        { label: 'Trophées', value: stats.trophies, icon: <FaTrophy className="text-yellow-400 text-2xl md:text-3xl" /> },
        { label: "Années d'existence", value: stats.yearsOfExistence, icon: <FaCalendarAlt className="text-green-400 text-2xl md:text-3xl" /> }
    ];

    return (
        <section className="mt-16 md:mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-gradient rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-yellow/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
                
                <div className="relative z-10">
                    <div className="text-center mb-10 md:mb-16">
                        <span className="text-primary-yellow font-bold uppercase tracking-widest text-[10px] md:text-xs">Les chiffres clés</span>
                        <h2 className="text-3xl md:text-5xl font-black italic text-white mt-1 md:mt-2">Notre <span className="text-primary-blue">Impact</span></h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                        {statItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors group"
                            >
                                <div className="mb-4 p-4 bg-dark-bg/50 rounded-full group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <span className="text-3xl md:text-4xl font-black italic text-white mb-2">
                                    {item.value}
                                </span>
                                <span className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center">
                                    {item.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PublicStats;
