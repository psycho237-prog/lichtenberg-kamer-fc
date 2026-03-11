import React, { useState, useEffect } from 'react';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PageHero from '../../components/Shared/PageHero';
import API from '../../services/api';

const Team = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const { data } = await API.get('/players');
                setPlayers(data);
            } catch (error) {
                // Fallback to mock data if API fails during dev
                setPlayers([
                    { _id: 1, name: 'ONANA LEGRAND', number: 10, position: 'Milieux', goals: 5, assists: 8 },
                    { _id: 2, name: 'ZAMBO JOSEPH', number: 1, position: 'Gardiens', goals: 0, assists: 0 },
                    { _id: 3, name: 'EBOUÉ SAMUEL', number: 9, position: 'Attaquants', goals: 12, assists: 3 },
                    { _id: 4, name: 'KOULIBALY JR', number: 4, position: 'Défenseurs', goals: 2, assists: 1 },
                    { _id: 5, name: 'MARC DESAILLY', number: 5, position: 'Défenseurs', goals: 1, assists: 0 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, []);

    const categories = ['Jeune', 'Vétéran'];
    const positions = ['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants'];

    return (
        <div className="bg-dark-bg min-h-screen pb-20">
            <PageHero
                title="NOTRE ÉQUIPE"
                subtitle="Découvrez les visages qui forgent la légende de Lichtenberg-Kamer e.V. Une équipe unie, prête pour la victoire."
                bgImage="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                {categories.map((cat) => {
                    const playersInCat = players.filter(p => (p.category || 'Jeune') === cat);
                    if (playersInCat.length === 0) return null;

                    return (
                        <div key={cat} className="mb-24">
                            <div className="flex flex-col mb-12">
                                <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter flex items-center">
                                    <span className="text-primary-blue mr-4">/</span> {cat}S
                                </h2>
                                <div className="h-1 w-24 bg-primary-blue mt-2"></div>
                            </div>

                            {positions.map((pos) => {
                                const posPlayers = playersInCat.filter(p => p.position === pos);
                                if (posPlayers.length === 0) return null;

                                return (
                                    <section key={pos} className="mb-16">
                                        <div className="flex items-center space-x-4 mb-8">
                                            <h3 className="text-xl font-black italic text-white/50 uppercase tracking-widest flex items-center">
                                                {pos}
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {posPlayers.map(player => (
                                                <PlayerCard key={player._id} player={player} />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Team;
