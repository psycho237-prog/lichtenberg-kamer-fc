import { API_BASE } from '../../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageHero from '../../components/Shared/PageHero';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/matches');
                setMatches(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-blue"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <PageHero
                title="CALENDRIER & RÉSULTATS"
                subtitle="Suivez le parcours du Lichtenberg-Kamer FC. Ne manquez aucune rencontre."
                bgImage="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-5xl mx-auto px-4 mt-16">

                <div className="space-y-6">
                    {matches.map((match, index) => (
                        <motion.div
                            key={match._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card-gradient rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between group hover:border-primary-blue/30 transition-all shadow-xl"
                        >
                            <div className="text-center md:text-left mb-6 md:mb-0">
                                <span className="inline-block bg-primary-blue/10 text-primary-blue text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full italic mb-3">
                                    {match.competition || 'Elite One'}
                                </span>
                                <div className="text-white font-black italic text-2xl uppercase">
                                    {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-widest">
                                    {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {match.location}
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-6 md:space-x-12">
                                <div className="text-center w-24 md:w-32">
                                    <div className="text-white font-black italic uppercase text-lg mb-2">LK FC</div>
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 group-hover:border-primary-blue/50 transition-colors">
                                        <img src="/images/logo.png" className="w-10 h-10 object-contain" alt="LK FC" />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <span className="text-5xl font-black italic text-white">{match.score.home}</span>
                                    <span className="text-gray-700 font-black text-3xl">-</span>
                                    <span className="text-5xl font-black italic text-white">{match.score.away}</span>
                                </div>

                                <div className="text-center w-24 md:w-32">
                                    <div className="text-white font-black italic uppercase text-lg mb-2 truncate">{match.opponent}</div>
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 group-hover:border-primary-yellow/50 transition-colors uppercase font-black italic text-primary-yellow">
                                        {match.opponent.slice(0, 2)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-0">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg italic ${match.status === 'finished' ? 'bg-gray-500/10 text-gray-400' :
                                    match.status === 'ongoing' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-blue text-white'
                                    }`}>
                                    {match.status === 'finished' ? 'Terminé' : match.status === 'ongoing' ? 'En Direct' : 'À Venir'}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {matches.length === 0 && (
                        <div className="text-center py-20 text-gray-500 uppercase font-black italic tracking-widest">
                            Aucun match programmé pour le moment
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Matches;
