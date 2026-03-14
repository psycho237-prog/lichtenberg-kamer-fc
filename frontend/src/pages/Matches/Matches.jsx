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
                subtitle="Suivez le parcours du Lichtenberg-Kamer e.V. Ne manquez aucune rencontre."
                bgImage="https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-5xl mx-auto px-4 mt-16">

                <div className="space-y-6">
                    {matches.map((match, index) => (
                        <motion.div
                            key={match._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-card-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-transform hover:scale-[1.01]"
                        >
                            <div className="flex flex-row items-center justify-between w-full">
                                {/* Team A */}
                                <div className="flex-1 p-2 md:p-8 flex flex-col items-center justify-center space-y-2 md:space-y-4">
                                    <div className="w-12 h-12 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center p-2 md:p-4 border border-white/10 shrink-0">
                                        <img src="/images/logo.png" alt="LK FC" className="w-full h-auto" loading="lazy" />
                                    </div>
                                    <h3 className="text-[8px] md:text-xl font-bold italic text-white text-center leading-tight truncate px-1 max-w-full">LK e.V</h3>
                                </div>

                                {/* Match Info */}
                                <div className="flex-[1.5] bg-primary-blue/5 p-2 md:p-8 border-x border-white/5 flex flex-col items-center justify-center text-center">
                                    <span className="text-primary-yellow font-bold uppercase tracking-widest text-[8px] md:text-xs mb-1 md:mb-2">{match.competition || 'Elite One'}</span>

                                    <p className="text-white font-black italic uppercase text-[10px] md:text-xl md:mb-1">
                                        {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>

                                    {match.status === 'finished' || match.status === 'ongoing' ? (
                                        <div className="text-3xl md:text-5xl font-black italic text-white my-1 md:my-3 tracking-widest">
                                            {match.score.home} - {match.score.away}
                                        </div>
                                    ) : (
                                        <div className="text-xl md:text-4xl font-black italic text-white mb-1 md:mb-2 my-1 md:my-3">VS</div>
                                    )}

                                    <div className="space-y-0.5 md:space-y-1">
                                        <p className="text-gray-400 text-[6px] md:text-sm font-bold tracking-widest uppercase">
                                            {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • {match.location || 'Stadium'}
                                        </p>
                                    </div>
                                    <button className={`mt-2 md:mt-4 px-3 py-1 md:px-6 md:py-2 font-black italic uppercase text-[6px] md:text-xs rounded transition-colors shadow-lg ${match.status === 'finished' ? 'bg-white/10 text-white cursor-default' :
                                            match.status === 'ongoing' ? 'bg-red-600 text-white animate-pulse' :
                                                'bg-primary-yellow text-black hover:bg-yellow-400'
                                        }`}
                                    >
                                        <span>
                                            {match.status === 'finished' ? 'Terminé' : match.status === 'ongoing' ? 'En Direct' : 'À Venir'}
                                        </span>
                                    </button>
                                </div>

                                {/* Team B */}
                                <div className="flex-1 p-2 md:p-8 flex flex-col items-center justify-center space-y-2 md:space-y-4">
                                    <div className="w-12 h-12 md:w-24 md:h-24 bg-white/5 rounded-full flex items-center justify-center p-2 md:p-4 border border-white/10 overflow-hidden text-center shrink-0">
                                        <span className="text-xl md:text-3xl font-black italic uppercase text-primary-yellow opacity-50">
                                            {match.opponent.substring(0, 2)}
                                        </span>
                                    </div>
                                    <h3 className="text-[8px] md:text-xl font-bold italic text-white text-center uppercase leading-tight truncate px-1 max-w-full">{match.opponent}</h3>
                                </div>
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
