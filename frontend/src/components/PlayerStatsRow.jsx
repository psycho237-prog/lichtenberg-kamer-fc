import React from 'react';
import { FaStar } from 'react-icons/fa';

const PlayerStatsRow = ({ rank, playerPhoto, playerName, matchesPlayed, goals, assists, isTopScorer }) => {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td className="py-4 px-1 md:px-4 text-gray-500 font-bold w-8 md:w-12 text-center text-[10px] md:text-sm">
                {rank}
            </td>
            <td className="py-2 px-1 md:px-4">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="relative shrink-0">
                        <img
                            src={playerPhoto || '/images/default-player.png'}
                            alt={playerName}
                            className={`w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border-2 ${isTopScorer ? 'border-primary-yellow shadow-[0_0_10px_rgba(245,197,24,0.3)]' : 'border-white/10'}`}
                            loading="lazy"
                        />
                        {isTopScorer && (
                            <div className="absolute -top-1 -right-1 bg-primary-yellow text-black rounded-full p-0.5 md:p-1 text-[6px] md:text-[8px]">
                                <FaStar />
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <span className={`font-bold transition-colors text-[11px] md:text-sm truncate block ${isTopScorer ? 'text-primary-yellow' : 'text-white'}`}>
                            {playerName}
                            {isTopScorer && <FaStar className="hidden md:inline-block ml-2 text-primary-yellow text-xs" />}
                        </span>
                    </div>
                </div>
            </td>
            <td className="py-4 px-2 md:px-4 text-right font-medium text-gray-400 text-[11px] md:text-sm">
                {matchesPlayed}
            </td>
            <td className="py-4 px-2 md:px-4 text-right font-black italic text-primary-yellow text-[11px] md:text-sm">
                {goals}
            </td>
            <td className="py-4 px-2 md:px-4 text-right font-medium text-gray-400 text-[11px] md:text-sm">
                {assists}
            </td>
        </tr>
    );
};

export default PlayerStatsRow;
