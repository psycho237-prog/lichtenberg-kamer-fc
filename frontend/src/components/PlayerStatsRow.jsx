import React from 'react';
import { FaStar } from 'react-icons/fa';

const PlayerStatsRow = ({ rank, playerPhoto, playerName, matchesPlayed, goals, assists, isTopScorer }) => {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td className="py-4 px-0.5 md:px-4 text-gray-500 font-bold w-6 md:w-12 text-center text-[9px] md:text-sm">
                {rank}
            </td>
            <td className="py-2 px-0.5 md:px-4">
                <div className="flex items-center space-x-1 md:space-x-4">
                    <div className="relative shrink-0">
                        <img
                            src={playerPhoto || '/images/default-player.png'}
                            alt={playerName}
                            className={`w-6 h-6 md:w-12 md:h-12 rounded-full object-cover border-2 ${isTopScorer ? 'border-primary-yellow shadow-[0_0_10px_rgba(245,197,24,0.3)]' : 'border-white/10'}`}
                            loading="lazy"
                        />
                    </div>
                    <div className="min-w-0 pr-1">
                        <span className={`font-bold transition-colors text-[10px] md:text-sm truncate block ${isTopScorer ? 'text-primary-yellow' : 'text-white'}`}>
                            {playerName}
                        </span>
                    </div>
                </div>
            </td>
            <td className="py-4 px-1 md:px-4 text-right font-medium text-gray-400 text-[10px] md:text-sm">
                {matchesPlayed}
            </td>
            <td className="py-4 px-1 md:px-4 text-right font-black italic text-primary-yellow text-[10px] md:text-sm">
                {goals}
            </td>
            <td className="py-4 px-1 md:px-4 text-right font-medium text-gray-400 text-[10px] md:text-sm">
                {assists}
            </td>
        </tr>
    );
};

export default PlayerStatsRow;
