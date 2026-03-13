import React from 'react';
import { FaStar } from 'react-icons/fa';

const PlayerStatsRow = ({ rank, playerPhoto, playerName, matchesPlayed, goals, assists, isTopScorer }) => {
    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            <td className="py-4 px-4 text-gray-500 font-bold w-12 text-center">
                {rank}
            </td>
            <td className="py-2 px-4">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={playerPhoto || '/images/default-player.png'}
                            alt={playerName}
                            className={`w-12 h-12 rounded-full object-cover border-2 ${isTopScorer ? 'border-primary-yellow shadow-[0_0_10px_rgba(245,197,24,0.3)]' : 'border-white/10'}`}
                            loading="lazy"
                        />
                        {isTopScorer && (
                            <div className="absolute -top-1 -right-1 bg-primary-yellow text-black rounded-full p-1 text-[8px]">
                                <FaStar />
                            </div>
                        )}
                    </div>
                    <div>
                        <span className={`font-bold transition-colors ${isTopScorer ? 'text-primary-yellow' : 'text-white'}`}>
                            {playerName}
                            {isTopScorer && <FaStar className="inline-block ml-2 text-primary-yellow text-xs" />}
                        </span>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4 text-right font-medium text-gray-400">
                {matchesPlayed}
            </td>
            <td className="py-4 px-4 text-right font-black italic text-primary-yellow">
                {goals}
            </td>
            <td className="py-4 px-4 text-right font-medium text-gray-400">
                {assists}
            </td>
        </tr>
    );
};

export default PlayerStatsRow;
