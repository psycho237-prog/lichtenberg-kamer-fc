import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight, FaTimes } from 'react-icons/fa';
import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';

const PlayerCard = ({ player }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="card-gradient group relative overflow-hidden rounded-xl border border-white/5 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div className="relative h-48 md:h-96 overflow-hidden">
                    {/* Number Background */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 text-4xl md:text-8xl font-black italic text-white/5 select-none transition-all group-hover:text-primary-blue/10">
                        {player.number}
                    </div>

                    <img
                        src={player.photo ? getImageUrl(player.photo) : 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                        alt={player.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                        loading="lazy"
                    />

                    {/* Overlay Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-dark-bg/90 via-dark-bg/60 to-transparent">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="text-primary-yellow font-black italic text-lg md:text-2xl mr-1.5 md:mr-2">#{player.number}</span>
                                <h3 className="text-[11px] md:text-xl font-black italic text-white leading-tight uppercase">{player.name}</h3>
                                <p className="text-gray-400 text-[8px] md:text-xs font-bold uppercase tracking-widest mt-0.5 md:mt-1">{player.position}</p>
                            </div>
                            <button className="hidden md:block bg-primary-yellow text-black p-2 rounded-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="px-2 py-3 md:px-6 md:py-4 grid grid-cols-3 gap-1 md:gap-2 border-t border-white/5 bg-black/20">
                    <div className="text-center">
                        <p className="text-[7px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Matchs</p>
                        <p className="text-xs md:text-sm font-black italic text-white">{player.matchesPlayed || 0}</p>
                    </div>
                    <div className="text-center border-x border-white/5">
                        <p className="text-[7px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Buts</p>
                        <p className="text-xs md:text-sm font-black italic text-white">{player.goals || 0}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[7px] md:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Passes</p>
                        <p className="text-xs md:text-sm font-black italic text-white">{player.assists || 0}</p>
                    </div>
                </div>
            </motion.div>

            {/* Modal / Lightbox */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                    <div className="max-w-md w-full bg-card-bg rounded-2xl overflow-hidden border border-white/10 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-primary-blue hover:text-white transition-colors">
                            <FaTimes />
                        </button>

                        <div className="relative h-96">
                            <img
                                src={player.photo ? getImageUrl(player.photo) : 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                                alt={player.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-bg/90 to-transparent">
                                <span className="text-primary-yellow font-black italic text-3xl mr-2">#{player.number}</span>
                                <h3 className="text-2xl font-black italic text-white leading-tight uppercase">{player.name}</h3>
                                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">{player.position}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <h4 className="text-primary-blue font-bold uppercase tracking-widest text-xs mb-4">Statistiques Saison</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black italic text-white mb-1">{player.matchesPlayed || 0}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Matchs</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black italic text-white mb-1">{player.goals || 0}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Buts</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl text-center">
                                    <p className="text-2xl font-black italic text-white mb-1">{player.assists || 0}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Passes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlayerCard;
