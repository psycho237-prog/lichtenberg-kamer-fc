import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

const PlayerCard = ({ player }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="card-gradient group relative overflow-hidden rounded-xl border border-white/5"
        >
            <div className="relative h-96 overflow-hidden">
                {/* Number Background */}
                <div className="absolute top-4 right-4 text-8xl font-black italic text-white/5 select-none transition-all group-hover:text-primary-blue/10">
                    {player.number}
                </div>

                <img
                    src={player.photo ? `http://localhost:5000${player.photo}` : 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'}
                    alt={player.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale hover:grayscale-0"
                />

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-bg to-transparent">
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="text-primary-yellow font-black italic text-2xl mr-2">#{player.number}</span>
                            <h3 className="text-xl font-black italic text-white leading-tight uppercase">{player.name}</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{player.position}</p>
                        </div>
                        <button className="bg-primary-yellow text-black p-2 rounded-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="px-6 py-4 grid grid-cols-3 gap-2 border-t border-white/5 bg-black/20">
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Matchs</p>
                    <p className="text-sm font-black italic text-white">{player.matchesPlayed || 0}</p>
                </div>
                <div className="text-center border-x border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Buts</p>
                    <p className="text-sm font-black italic text-white">{player.goals || 0}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Passes</p>
                    <p className="text-sm font-black italic text-white">{player.assists || 0}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default PlayerCard;
