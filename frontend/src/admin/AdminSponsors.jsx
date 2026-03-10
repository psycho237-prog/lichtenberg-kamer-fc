import { API_BASE } from '../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const AdminSponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        tier: 'partner',
        logo: null
    });

    const tiers = ['main', 'premium', 'partner'];

    const fetchSponsors = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/sponsors');
            setSponsors(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erreur de chargement des sponsors');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'logo') {
            setFormData({ ...formData, logo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('website', formData.website);
        data.append('tier', formData.tier);
        if (formData.logo) data.append('logo', formData.logo);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (editingSponsor) {
                await axios.put(`${API_BASE}/api/sponsors/${editingSponsor._id}`, data, config);
                toast.success('Sponsor mis à jour');
            } else {
                await axios.post(API_BASE + '/api/sponsors', data, config);
                toast.success('Sponsor ajouté');
            }

            setIsModalOpen(false);
            setEditingSponsor(null);
            setFormData({ name: '', website: '', tier: 'partner', logo: null });
            fetchSponsors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce sponsor ?')) {
            try {
                await axios.delete(`${API_BASE}/api/sponsors/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Sponsor supprimé');
                fetchSponsors();
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const openEditModal = (sponsor) => {
        setEditingSponsor(sponsor);
        setFormData({
            name: sponsor.name,
            website: sponsor.website || '',
            tier: sponsor.tier,
            logo: null
        });
        setIsModalOpen(true);
    };

    return (
        <div className="flex bg-dark-bg min-h-screen text-white">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic uppercase italic">Gestion Sponsors</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les partenaires du club</p>
                    </div>
                    <button
                        onClick={() => { setEditingSponsor(null); setFormData({ name: '', website: '', tier: 'partner', logo: null }); setIsModalOpen(true); }}
                        className="btn-primary space-x-2"
                    >
                        <FaPlus />
                        <span>Ajouter un Sponsor</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sponsors.map(sponsor => (
                            <div key={sponsor._id} className="card-gradient rounded-2xl overflow-hidden border border-white/5 flex flex-col group p-6">
                                <div className="h-32 flex items-center justify-center bg-white/5 rounded-xl mb-4 relative">
                                    <img
                                        src={`${API_BASE}${sponsor.logo}`}
                                        className="max-h-20 max-w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                        alt={sponsor.name}
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(sponsor)} className="p-2 bg-black/60 hover:bg-primary-blue text-white rounded-lg transition-colors"><FaEdit /></button>
                                        <button onClick={() => handleDelete(sponsor._id)} className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-lg transition-colors"><FaTrash /></button>
                                    </div>
                                </div>
                                <h4 className="text-lg font-black italic uppercase italic text-center mb-1">{sponsor.name}</h4>
                                <span className={`text-[10px] font-black uppercase tracking-widest text-center px-2 py-1 rounded-full ${sponsor.tier === 'main' ? 'bg-primary-yellow text-black' :
                                        sponsor.tier === 'premium' ? 'bg-primary-blue text-white' : 'bg-gray-700 text-gray-300'
                                    }`}>
                                    {sponsor.tier}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h2 className="text-2xl font-black italic uppercase italic mb-8 text-white">
                                {editingSponsor ? 'Modifier Sponsor' : 'Nouveau Sponsor'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Nom du Sponsor</label>
                                    <input
                                        type="text" name="name" value={formData.name} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Site Web</label>
                                    <input
                                        type="url" name="website" value={formData.website} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Niveau (Tier)</label>
                                    <select
                                        name="tier" value={formData.tier} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none appearance-none"
                                    >
                                        {tiers.map(t => <option key={t} value={t} className="bg-card-bg text-white">{t.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Logo</label>
                                    <input
                                        type="file" name="logo" onChange={handleChange}
                                        className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary-blue/20 file:text-primary-blue hover:file:bg-primary-blue/30 cursor-pointer"
                                        required={!editingSponsor}
                                    />
                                </div>

                                <button type="submit" className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase italic">
                                    {editingSponsor ? 'Mettre à jour' : 'Ajouter le sponsor'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSponsors;
