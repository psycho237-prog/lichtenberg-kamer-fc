import React from 'react';
import { motion } from 'framer-motion';

const NextMatch = ({ match }) => {
    if (!match) return null;
    return (
        <div className="relative z-20 -mt-24 max-w-5xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    {/* Team A */}
                    <div className="p-8 flex flex-col items-center justify-center space-y-4">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10">
                            <img src="/images/logo.png" alt="LK FC" className="w-full h-auto" />
                        </div>
                        <h3 className="text-xl font-bold italic text-white text-center">LICHTENBERG FC</h3>
                    </div>

                    {/* Match Info */}
                    <div className="bg-primary-blue/5 p-8 border-x border-white/5 flex flex-col items-center justify-center text-center">
                        <span className="text-primary-yellow font-bold uppercase tracking-widest text-xs mb-2">{match.competition || 'Elite One'}</span>
                        <div className="text-4xl font-black italic text-white mb-2">VS</div>
                        <div className="space-y-1">
                            <p className="text-white font-bold uppercase">{match.location || 'Stadium Ahidjo'}</p>
                            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">
                                {new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} • {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <button className="mt-6 px-6 py-2 bg-primary-yellow text-black font-black italic uppercase text-xs rounded hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,200,0,0.3)]">
                            <span className={match.status === 'ongoing' ? 'animate-pulse text-red-600 font-extrabold' : ''}>
                                {match.status === 'ongoing' ? 'EN DIRECT' : 'TICKETS DISPONIBLES'}
                            </span>
                        </button>
                    </div>

                    {/* Team B */}
                    <div className="p-8 flex flex-col items-center justify-center space-y-4">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10 overflow-hidden text-center">
                            <span className="text-3xl font-black italic uppercase text-primary-yellow opacity-50">
                                {match.opponent.substring(0, 2)}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold italic text-white text-center uppercase">{match.opponent}</h3>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NextMatch;
