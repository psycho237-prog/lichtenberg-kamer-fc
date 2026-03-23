import { API_BASE } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const AdminMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMatch, setEditingMatch] = useState(null);
    const [formData, setFormData] = useState({
        opponent: '',
        date: '',
        location: '',
        isHome: true,
        score: { home: 0, away: 0 },
        status: 'upcoming',
        competition: 'Elite One',
        opponentLogo: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const statusOptions = ['upcoming', 'ongoing', 'finished'];

    const fetchMatches = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/matches');
            setMatches(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erreur de chargement');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'homeScore' || name === 'awayScore') {
            const scoreSide = name === 'homeScore' ? 'home' : 'away';
            setFormData({
                ...formData,
                score: { ...formData.score, [scoreSide]: parseInt(value) || 0 }
            });
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'score') {
                    data.append('score[home]', formData.score.home);
                    data.append('score[away]', formData.score.away);
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (logoFile) {
                data.append('opponentLogo', logoFile);
            }

            if (editingMatch) {
                await axios.put(`${API_BASE}/api/matches/${editingMatch._id}`, data, config);
                toast.success('Match mis à jour');
            } else {
                await axios.post(API_BASE + '/api/matches', data, config);
                toast.success('Match ajouté');
            }

            setIsModalOpen(false);
            setEditingMatch(null);
            setLogoFile(null);
            setLogoPreview(null);
            setFormData({
                opponent: '',
                date: '',
                location: '',
                isHome: true,
                score: { home: 0, away: 0 },
                status: 'upcoming',
                competition: 'Elite One',
                opponentLogo: ''
            });
            fetchMatches();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce match ?')) {
            try {
                await axios.delete(`${API_BASE}/api/matches/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Match supprimé');
                fetchMatches();
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const openEditModal = (match) => {
        setEditingMatch(match);
        setFormData({
            opponent: match.opponent,
            date: new Date(match.date).toISOString().slice(0, 16),
            location: match.location || '',
            isHome: match.isHome,
            score: match.score || { home: 0, away: 0 },
            status: match.status,
            competition: match.competition || 'Elite One',
            opponentLogo: match.opponentLogo || ''
        });
        if (match.opponentLogo) {
            setLogoPreview(getImageUrl(match.opponentLogo));
        } else {
            setLogoPreview(null);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic">Gestion Calendrier</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les rencontres du club</p>
                    </div>
                    <button
                        onClick={() => { setEditingMatch(null); setIsModalOpen(true); }}
                        className="btn-primary space-x-2"
                    >
                        <FaPlus />
                        <span>Programmer un Match</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {matches.map(match => (
                            <div key={match._id} className="card-gradient rounded-2xl p-6 border border-white/5 flex items-center justify-between group">
                                <div className="flex items-center space-x-8">
                                    <div className="text-center w-24">
                                        <div className="text-[10px] font-black uppercase text-primary-yellow italic mb-1">
                                            {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="text-white font-black italic text-xl uppercase">
                                            {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-right w-32 flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-white border border-white/10 overflow-hidden mb-1 flex items-center justify-center p-1 shadow-inner">
                                                <img src="/images/logo.png" alt="LK FC" className="w-full h-auto" />
                                            </div>
                                            <div className="text-white font-black italic uppercase italic text-[10px]">Lichtenberg FC</div>
                                        </div>
                                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-4">
                                            <span className="text-2xl font-black italic text-white">{match.score.home}</span>
                                            <span className="text-gray-600 font-black">-</span>
                                            <span className="text-2xl font-black italic text-white">{match.score.away}</span>
                                        </div>
                                        <div className="text-left w-32 flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-white border border-white/10 overflow-hidden mb-1 flex items-center justify-center p-1 shadow-inner">
                                                {match.opponentLogo ? (
                                                    <img src={getImageUrl(match.opponentLogo)} alt="Opponent" className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="text-[10px] text-gray-400 font-bold">{match.opponent.substring(0, 2)}</div>
                                                )}
                                            </div>
                                            <div className="text-white font-black italic uppercase italic text-[10px]">{match.opponent}</div>
                                        </div>
                                    </div>

                                    <div className="hidden lg:block">
                                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Lieu & Compétition</div>
                                        <div className="text-white text-xs font-bold uppercase italic">{match.competition} • {match.location}</div>
                                    </div>

                                    <div className="hidden md:block">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full italic ${match.status === 'finished' ? 'bg-gray-500/10 text-gray-500' :
                                                match.status === 'ongoing' ? 'bg-red-500/10 text-red-500' : 'bg-primary-blue/10 text-primary-blue'
                                            }`}>
                                            {match.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(match)} className="p-2 bg-white/5 hover:bg-primary-blue text-white rounded-lg transition-colors"><FaEdit /></button>
                                    <button onClick={() => handleDelete(match._id)} className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-colors group-hover:block"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                        {matches.length === 0 && <p className="text-center text-gray-500 py-10 uppercase font-black italic tracking-widest">Aucun match programmé</p>}
                    </div>
                )}

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><FaTimes size={24} /></button>
                            <h2 className="text-2xl font-black italic text-white uppercase italic mb-8 uppercase italic">{editingMatch ? 'Modifier le Match' : 'Nouveau Match'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Logo Adversaire</label>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-xl border border-white/10 bg-white flex items-center justify-center overflow-hidden relative group">
                                                {logoPreview ? (
                                                    <>
                                                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setLogoFile(null);
                                                                setLogoPreview(null);
                                                                setFormData({ ...formData, opponentLogo: '' });
                                                            }}
                                                            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                                        >
                                                            <FaTrash size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="text-[8px] text-gray-400 font-bold uppercase text-center">No Logo</div>
                                                )}
                                            </div>
                                            <label className="btn-outline py-2 px-4 text-[10px] cursor-pointer">
                                                Choisir
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setLogoFile(file);
                                                        setLogoPreview(URL.createObjectURL(file));
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Adversaire</label>
                                        <input type="text" name="opponent" value={formData.opponent} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none uppercase font-black" required />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Date & Heure</label>
                                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Compétition</label>
                                        <input type="text" name="competition" value={formData.competition} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Lieu (Stade)</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none" placeholder="Ex: Stade Omnisport" />
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <div className="text-[10px] font-black uppercase text-primary-blue tracking-widest mb-4 italic">Score & Statut</div>
                                    <div className="grid grid-cols-3 gap-6 items-end">
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Lichtenberg FC</label>
                                            <input type="number" name="homeScore" value={formData.score.home} onChange={handleChange}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-black" />
                                        </div>
                                        <div className="flex flex-col items-center pb-2 text-gray-600 font-black">-</div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Adversaire</label>
                                            <input type="number" name="awayScore" value={formData.score.away} onChange={handleChange}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-center font-black" />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input type="checkbox" name="isHome" id="isHome" checked={formData.isHome} onChange={handleChange} className="accent-primary-blue" />
                                            <label htmlFor="isHome" className="ml-3 text-[10px] font-black uppercase text-gray-400 tracking-widest">Match à domicile</label>
                                        </div>
                                        <div className="w-1/2">
                                            <select name="status" value={formData.status} onChange={handleChange}
                                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-bold appearance-none">
                                                {statusOptions.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase italic">
                                    {editingMatch ? 'Mettre à jour le Calendrier' : 'Valider la Rencontre'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMatches;
