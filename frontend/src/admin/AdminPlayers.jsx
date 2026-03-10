import { API_BASE } from '../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const AdminPlayers = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        position: 'Gardiens',
        age: '',
        photo: null
    });

    const positions = ['Gardiens', 'Défenseurs', 'Milieux', 'Attaquants'];

    const fetchPlayers = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/players');
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
        data.append('age', formData.age);
        if (formData.photo) data.append('photo', formData.photo);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (editingPlayer) {
                await axios.put(`${API_BASE}/api/players/${editingPlayer._id}`, data, config);
                toast.success('Joueur mis à jour');
            } else {
                await axios.post(API_BASE + '/api/players', data, config);
                toast.success('Joueur ajouté');
            }

            setIsModalOpen(false);
            setEditingPlayer(null);
            setFormData({ name: '', number: '', position: 'Gardiens', age: '', photo: null });
            fetchPlayers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce joueur ?')) {
            try {
                await axios.delete(`${API_BASE}/api/players/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Joueur supprimé');
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
            age: player.age || '',
            photo: null
        });
        setIsModalOpen(true);
    };

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic">Gestion l'Équipe</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les joueurs du club</p>
                    </div>
                    <button
                        onClick={() => { setEditingPlayer(null); setIsModalOpen(true); }}
                        className="btn-primary space-x-2"
                    >
                        <FaPlus />
                        <span>Ajouter un Joueur</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {players.map(player => (
                            <div key={player._id} className="card-gradient rounded-2xl p-6 border border-white/5 flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5">
                                        <img
                                            src={player.photo ? `${API_BASE}${player.photo}` : '/images/hero.png'}
                                            className="w-full h-full object-cover"
                                            alt={player.name}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black italic uppercase leading-none">{player.name}</h4>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="text-primary-blue text-[10px] font-black uppercase tracking-widest italic ">{player.position}</span>
                                            <span className="text-white/20">•</span>
                                            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">N° {player.number}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(player)} className="p-2 bg-white/5 hover:bg-primary-blue text-white rounded-lg transition-colors"><FaEdit /></button>
                                    <button onClick={() => handleDelete(player._id)} className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-colors"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
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
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h2 className="text-2xl font-black italic text-white uppercase italic mb-8">
                                {editingPlayer ? 'Modifier Joueur' : 'Ajouter un Joueur'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Nom Complet</label>
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Numéro</label>
                                        <input
                                            type="number" name="number" value={formData.number} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Position</label>
                                        <select
                                            name="position" value={formData.position} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none appearance-none"
                                        >
                                            {positions.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Âge</label>
                                        <input
                                            type="number" name="age" value={formData.age} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Photo</label>
                                    <input
                                        type="file" name="photo" onChange={handleChange}
                                        className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary-blue/20 file:text-primary-blue hover:file:bg-primary-blue/30 cursor-pointer"
                                    />
                                </div>

                                <button type="submit" className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase">
                                    {editingPlayer ? 'Mettre à jour' : 'Enregistrer Joueur'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPlayers;
