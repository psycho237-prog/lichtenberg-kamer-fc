import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import PageHero from '../../components/Shared/PageHero';
import PlayerStatsRow from '../../components/PlayerStatsRow';

const TopScorers = () => {
    const [players, setPlayers] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Tous');

    const filters = ['Tous', 'Domicile', 'Extérieur', 'Forme'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, sponsorRes] = await Promise.all([
                    axios.get(API_BASE + '/api/player-stats'),
                    axios.get(API_BASE + '/api/sponsors')
                ]);
                setPlayers(statsRes.data);
                setSponsors(sponsorRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-blue"></div>
        </div>
    );

    const topGoals = players.length > 0 ? Math.max(...players.map(p => p.goals || 0)) : 0;

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <PageHero
                title="CLASSEMENT DES BUTEURS"
                subtitle="Découvrez les statistiques individuelles de nos Lions sur le terrain."
                bgImage="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                {/* Filter Bar */}
                <div className="flex flex-nowrap items-center justify-start md:justify-center gap-2 mb-8 bg-card-bg/50 p-2 rounded-2xl backdrop-blur-md border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeFilter === filter
                                ? 'bg-primary-yellow text-black shadow-[0_0_15px_rgba(245,197,24,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="card-gradient rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                                <th className="py-6 px-4 text-center">#</th>
                                <th className="py-6 px-4">Joueur</th>
                                <th className="py-6 px-4 text-right">MJ</th>
                                <th className="py-6 px-4 text-right">But</th>
                                <th className="py-6 px-4 text-right">Ast</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => (
                                <PlayerStatsRow
                                    key={player._id}
                                    rank={index + 1}
                                    playerPhoto={player.photo}
                                    playerName={player.name}
                                    matchesPlayed={player.matchesPlayed}
                                    goals={player.goals}
                                    assists={player.assists}
                                    isTopScorer={player.goals > 0 && player.goals === topGoals}
                                />
                            ))}
                        </tbody>
                    </table>

                    {players.length === 0 && (
                        <div className="text-center py-20 text-gray-500 uppercase font-black italic tracking-widest">
                            Aucune statistique disponible
                        </div>
                    )}
                </div>

                {/* Sponsors Section */}
                {sponsors && sponsors.length > 0 && (
                    <div className="mt-20 border-t border-white/5 pt-12">
                        <div className="text-center mb-8">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] italic">Partenaires Officiels</span>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                            {sponsors.map(sponsor => (
                                <a
                                    key={sponsor._id}
                                    href={sponsor.website || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`transition-all duration-300 hover:scale-110 opacity-60 hover:opacity-100 ${!sponsor.website ? 'pointer-events-none' : ''}`}
                                >
                                    <img
                                        src={getImageUrl(sponsor.logo)}
                                        alt={sponsor.name}
                                        className="h-12 md:h-16 w-auto object-contain"
                                        title={sponsor.name}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopScorers;
