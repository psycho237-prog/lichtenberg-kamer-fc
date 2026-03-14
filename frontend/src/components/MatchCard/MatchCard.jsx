import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCalendar } from 'react-icons/fa';

const MatchCard = ({ match, isResult = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className={`card-gradient rounded-xl p-6 relative overflow-hidden ${isResult ? 'border-l-4 border-l-primary-yellow' : 'border-l-4 border-l-primary-blue'}`}
        >
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Teams Display */}
                <div className="flex items-center justify-between md:justify-start w-full md:w-auto md:space-x-8 flex-1">
                    <div className="text-center flex-1 md:flex-none">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center p-2 mx-auto mb-2">
                            <img src="/images/logo.png" alt="LK FC" className="w-full h-auto" />
                        </div>
                        <p className="text-[10px] md:text-xs font-black italic text-white uppercase tracking-tighter truncate max-w-[80px] md:max-w-none mx-auto">LK e.V</p>
                    </div>

                    <div className="text-center px-2 md:px-0">
                        {isResult ? (
                            <div className="text-xl md:text-3xl font-black italic text-primary-yellow bg-primary-yellow/10 px-3 md:px-4 py-1.5 md:py-2 rounded whitespace-nowrap">
                                {match.score.home} - {match.score.away}
                            </div>
                        ) : (
                            <div className="text-lg md:text-2xl font-black italic text-white px-2 py-1">VS</div>
                        )}
                        <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase mt-1 md:mt-2">{isResult ? 'Score Final' : 'Coup d\'envoi'}</p>
                    </div>

                    <div className="text-center flex-1 md:flex-none">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center p-2 mx-auto mb-2">
                            <img src={match.opponentLogo || 'https://images.squarespace-cdn.com/content/v1/5e3d7a9643d4632ff4b9ca04/1614115167644-88A7O6AOY7P6S6Q6T6B6/placeholder-logo.png'} alt={match.opponent} className="w-full h-auto grayscale opacity-50" />
                        </div>
                        <p className="text-[10px] md:text-xs font-black italic text-white uppercase tracking-tighter truncate max-w-[80px] md:max-w-none mx-auto">{match.opponent}</p>
                    </div>
                </div>

                {/* Info & Action */}
                <div className="flex flex-col items-center md:items-end justify-center space-y-2 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 min-w-[200px]">
                    <span className="text-primary-blue font-bold uppercase tracking-widest text-[10px]">{match.competition}</span>
                    <p className="text-white font-bold text-sm">{match.stadium}</p>
                    <p className="text-gray-400 text-xs">{new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

                    <button className={`mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded font-black italic uppercase text-[10px] transition-colors ${isResult ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-primary-blue text-white hover:bg-blue-600'}`}>
                        {isResult ? (
                            <><FaPlay /> <span>Résumé Match</span></>
                        ) : (
                            <><FaCalendar /> <span>Détails</span></>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MatchCard;
