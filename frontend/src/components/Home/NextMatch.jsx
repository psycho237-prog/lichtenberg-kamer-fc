import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/imageUtils';

const NextMatch = ({ match }) => {
    if (!match) return null;
    return (
        <div className="relative z-20 -mt-24 max-w-5xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 80 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
                className="bg-card-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
            >
                <div className="flex flex-row items-center justify-between w-full">
                    {/* Team A */}
                    <div className="flex-1 p-2 md:p-8 flex flex-col items-center justify-center space-y-2 md:space-y-4">
                        <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-1.5 md:p-3 border border-white/10 shrink-0 shadow-lg shadow-black/20">
                            <img src="/images/logo.png" alt="LK FC" className="w-full h-auto" loading="lazy" />
                        </div>
                        <h3 className="text-[8px] md:text-xl font-bold italic text-white text-center leading-tight">LICHTENBERG-KAMER e.V</h3>
                    </div>

                    {/* Match Info */}
                    <div className="flex-[1.5] bg-primary-blue/5 p-2 md:p-8 border-x border-white/5 flex flex-col items-center justify-center text-center">
                        <span className="text-primary-yellow font-bold uppercase tracking-widest text-[8px] md:text-xs mb-1 md:mb-2">{match.competition || 'Elite One'}</span>
                        <div className="text-xl md:text-4xl font-black italic text-white mb-1 md:mb-2">VS</div>
                        <div className="space-y-0.5 md:space-y-1">
                            <p className="text-white font-bold uppercase text-[8px] md:text-base">{match.location || 'Stadium Ahidjo'}</p>
                            <p className="text-gray-400 text-[6px] md:text-sm font-bold tracking-widest uppercase">
                                {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <button className="mt-2 md:mt-6 px-3 py-1 md:px-6 md:py-2 bg-primary-yellow text-black font-black italic uppercase text-[6px] md:text-xs rounded hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,200,0,0.3)]">
                            <span className={match.status === 'ongoing' ? 'animate-pulse text-red-600 font-extrabold' : ''}>
                                {match.status === 'ongoing' ? 'EN DIRECT' : 'À VENIR'}
                            </span>
                        </button>
                    </div>

                    {/* Team B */}
                    <div className="flex-1 p-2 md:p-8 flex flex-col items-center justify-center space-y-2 md:space-y-4">
                        <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-1.5 md:p-3 border border-white/10 overflow-hidden text-center shrink-0 shadow-lg shadow-black/20">
                            {match.opponentLogo ? (
                                <img
                                    src={getImageUrl(match.opponentLogo)}
                                    alt={match.opponent}
                                    className="w-full h-auto"
                                />
                            ) : (
                                <span className="text-xl md:text-3xl font-black italic uppercase text-primary-yellow opacity-50">
                                    {match.opponent.substring(0, 2)}
                                </span>
                            )}
                        </div>
                        <h3 className="text-[8px] md:text-xl font-bold italic text-white text-center uppercase leading-tight">{match.opponent}</h3>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NextMatch;
