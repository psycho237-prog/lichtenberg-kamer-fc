import { API_BASE } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const AdminPlayerStats = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        position: 'Attaquants',
        matchesPlayed: 0,
        goals: 0,
        assists: 0,
        photo: null
    });

    const positions = ['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants'];

    const fetchPlayers = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/player-stats');
            setPlayers(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erreur de chargement');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'photo') {
            setFormData({ ...formData, photo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('number', formData.number);
        data.append('position', formData.position);
        data.append('matchesPlayed', formData.matchesPlayed);
        data.append('goals', formData.goals);
        data.append('assists', formData.assists);
        if (formData.photo) data.append('photo', formData.photo);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (editingPlayer) {
                await axios.put(`${API_BASE}/api/player-stats/${editingPlayer._id}`, data, config);
                toast.success('Statistiques mises à jour');
            } else {
                await axios.post(API_BASE + '/api/player-stats', data, config);
                toast.success('Joueur et stats ajoutés');
            }

            setIsModalOpen(false);
            setEditingPlayer(null);
            setFormData({ name: '', number: '', position: 'Attaquants', matchesPlayed: 0, goals: 0, assists: 0, photo: null });
            fetchPlayers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ces statistiques ?')) {
            try {
                await axios.delete(`${API_BASE}/api/player-stats/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Supprimé avec succès');
                fetchPlayers();
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const openEditModal = (player) => {
        setEditingPlayer(player);
        setFormData({
            name: player.name,
            number: player.number,
            position: player.position,
            matchesPlayed: player.matchesPlayed || 0,
            goals: player.goals || 0,
            assists: player.assists || 0,
            photo: null
        });
        setIsModalOpen(true);
    };

    return (
        <div className="flex bg-dark-bg min-h-screen font-sport">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase">Stats Joueurs</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les buts et passes décisives</p>
                    </div>
                    <button
                        onClick={() => { setEditingPlayer(null); setIsModalOpen(true); }}
                        className="btn-primary space-x-2"
                    >
                        <FaPlus />
                        <span>Ajouter des Stats</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <div className="card-gradient rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <th className="py-6 px-6">Joueur</th>
                                    <th className="py-6 px-6 text-center">Matchs</th>
                                    <th className="py-6 px-6 text-center">Buts</th>
                                    <th className="py-6 px-6 text-center">Assists</th>
                                    <th className="py-6 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map(player => (
                                    <tr key={player._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={player.photo ? getImageUrl(player.photo) : '/images/default-player.png'}
                                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                                    alt={player.name}
                                                />
                                                <div>
                                                    <div className="text-white font-black italic uppercase text-sm">{player.name}</div>
                                                    <div className="text-primary-blue text-[10px] font-bold uppercase tracking-widest">N° {player.number} • {player.position}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center text-gray-400 font-bold">{player.matchesPlayed}</td>
                                        <td className="py-4 px-6 text-center text-primary-yellow font-black italic text-lg">{player.goals}</td>
                                        <td className="py-4 px-6 text-center text-gray-400 font-bold">{player.assists}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={() => openEditModal(player)} className="p-2 bg-white/5 hover:bg-primary-blue text-white rounded-lg transition-colors"><FaEdit /></button>
                                                <button onClick={() => handleDelete(player._id)} className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-colors"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><FaTimes size={24} /></button>

                            <h2 className="text-2xl font-black italic text-white uppercase mb-8">
                                {editingPlayer ? 'Modifier les Stats' : 'Ajouter un Joueur & Stats'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Nom</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" required />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">N° Maillot</label>
                                        <input type="number" name="number" value={formData.number} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Position</label>
                                    <select name="position" value={formData.position} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none">
                                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Matchs (MJ)</label>
                                        <input type="number" name="matchesPlayed" value={formData.matchesPlayed} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Buts</label>
                                        <input type="number" name="goals" value={formData.goals} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Assists</label>
                                        <input type="number" name="assists" value={formData.assists} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Photo du Joueur</label>
                                    <input type="file" name="photo" onChange={handleChange} className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary-blue/20 file:text-primary-blue cursor-pointer" />
                                </div>

                                <button type="submit" className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase">
                                    {editingPlayer ? 'Mettre à jour' : 'Enregistrer'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPlayerStats;
