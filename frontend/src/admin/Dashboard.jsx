import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const stats = [
        { label: 'Visites Site', value: '45.2k', trend: '+12%', color: 'blue' },
        { label: 'Ventes Shop', value: '1.2M', trend: '+8%', color: 'green' },
        { label: 'Billets Vendus', value: '85%', trend: 'Stable', color: 'yellow' },
        { label: 'Inscrits Académie', value: '128', trend: '+18%', color: 'purple' },
    ];

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic">Tableau de Bord</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer Lichtenberg-Kamer FC</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="btn-primary py-3">Créer Article</button>
                        <button className="btn-outline py-3 bg-white/5 border-white/10 hover:border-primary-blue">Ajouter Joueur</button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="card-gradient p-6 rounded-2xl border border-white/5">
                            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1">{stat.label}</span>
                            <div className="flex justify-between items-end">
                                <span className="text-3xl font-black italic text-white leading-none">{stat.value}</span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${stat.trend.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Section Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 card-gradient rounded-2xl p-8 border border-white/5">
                        <h3 className="text-white font-black italic uppercase text-lg mb-6">Activité Récente</h3>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue font-bold">N</div>
                                        <div>
                                            <p className="text-white font-bold text-sm">Nouvel article publié</p>
                                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">il y a 2 heures • par Admin</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-500 hover:text-white transition-colors">•••</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-gradient rounded-2xl p-8 border border-white/5">
                        <h3 className="text-white font-black italic uppercase text-lg mb-6">Prochains Événements</h3>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-primary-yellow text-[10px] font-black uppercase tracking-widest block mb-2">Entraînement</span>
                                <p className="text-white font-bold text-sm">Séance Tactique S1</p>
                                <p className="text-gray-500 text-[10px] mt-1 italic">Demain • 09:00 - Stadium</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-primary-blue text-[10px] font-black uppercase tracking-widest block mb-2">Match</span>
                                <p className="text-white font-bold text-sm">vs Canon Yaoundé</p>
                                <p className="text-gray-500 text-[10px] mt-1 italic">12 Oct • 18:00 - Ahidjo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
