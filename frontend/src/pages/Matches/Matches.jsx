import React, { useState, useEffect } from 'react';
import MatchCard from '../../components/MatchCard/MatchCard';
import API from '../../services/api';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const { data } = await API.get('/matches');
                setMatches(data);
            } catch (error) {
                setMatches([
                    { _id: 1, opponent: 'CANON YDE', date: '2024-10-24T16:00:00', stadium: 'Stade Ahmadou Ahidjo', competition: 'ELITE ONE', status: 'upcoming' },
                    { _id: 2, opponent: 'COTON SPORT', date: '2024-10-31T18:30:00', stadium: 'Stade Roumdé Adjia', competition: 'ELITE ONE', status: 'upcoming' },
                    { _id: 3, opponent: 'UNION DOUALA', date: '2024-10-15T15:00:00', stadium: 'Stade de la Réunification', competition: 'ELITE ONE', status: 'finished', score: { home: 3, away: 1 } },
                    { _id: 4, opponent: 'PWD BAMENDA', date: '2024-10-08T15:30:00', stadium: 'Stade Municipal', competition: 'ELITE ONE', status: 'finished', score: { home: 0, away: 0 } },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const upcoming = matches.filter(m => m.status === 'upcoming');
    const results = matches.filter(m => m.status === 'finished');

    return (
        <div className="bg-dark-bg min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 text-center">
                    <span className="text-primary-blue font-black italic uppercase tracking-widest bg-primary-blue/10 px-4 py-1 rounded">Calendrier Officiel</span>
                    <h1 className="text-5xl md:text-8xl font-black italic text-white mt-4 uppercase tracking-tighter">
                        CALENDRIER & <span className="text-primary-yellow">RÉSULTATS</span>
                    </h1>
                </header>

                {/* Upcoming Section */}
                <section className="mb-24">
                    <div className="flex items-center space-x-4 mb-10">
                        <h2 className="text-3xl font-black italic text-white uppercase flex items-center">
                            <span className="w-10 h-10 bg-primary-blue/20 text-primary-blue rounded flex items-center justify-center mr-4">
                                <span className="animate-pulse">●</span>
                            </span>
                            Prochains Matchs
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {upcoming.map(match => (
                            <MatchCard key={match._id} match={match} />
                        ))}
                    </div>
                </section>

                {/* Results Section */}
                <section>
                    <div className="flex items-center space-x-4 mb-10">
                        <h2 className="text-3xl font-black italic text-white uppercase flex items-center">
                            <span className="w-10 h-10 bg-primary-yellow/20 text-primary-yellow rounded flex items-center justify-center mr-4 italic">FT</span>
                            Derniers Résultats
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {results.map(match => (
                            <MatchCard key={match._id} match={match} isResult={true} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Matches;
