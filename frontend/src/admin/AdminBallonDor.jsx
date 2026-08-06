import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import { toast } from 'react-hot-toast';
import {
    FaPlus, FaTrash, FaEdit, FaTimes, FaTrophy, FaUserPlus,
    FaRedo, FaCrown, FaCheck, FaPause, FaLockOpen, FaLock, FaUsers
} from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const AdminBallonDor = () => {
    const [categories, setCategories] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // Category Modal state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({
        title: '',
        description: '',
        status: 'active',
        order: 0
    });

    // Candidate Modal state
    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [candidateType, setCandidateType] = useState('roster'); // 'roster' | 'custom'
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const [candidateForm, setCandidateForm] = useState({
        name: '',
        position: '',
        number: '',
        bio: '',
        photo: null,
        photoUrl: '',
        playerId: ''
    });

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/ballondor/categories`);
            setCategories(res.data || []);
            if (res.data && res.data.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(res.data[0]._id);
            }
        } catch (err) {
            toast.error('Erreur lors du chargement des catégories');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/players`);
            setPlayers(res.data || []);
        } catch (err) {
            console.error('Erreur de chargement des joueurs', err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchPlayers();
    }, []);

    // Active category
    const activeCategory = categories.find(cat => cat._id === selectedCategoryId) || categories[0];

    // ---- CATEGORY HANDLERS ----
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        };

        try {
            if (editingCategory) {
                await axios.put(`${API_BASE}/api/ballondor/categories/${editingCategory._id}`, categoryForm, config);
                toast.success('Catégorie mise à jour');
            } else {
                await axios.post(`${API_BASE}/api/ballondor/categories`, categoryForm, config);
                toast.success('Catégorie créée avec succès');
            }

            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            setCategoryForm({ title: '', description: '', status: 'active', order: 0 });
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const openEditCategoryModal = (cat) => {
        setEditingCategory(cat);
        setCategoryForm({
            title: cat.title || '',
            description: cat.description || '',
            status: cat.status || 'active',
            order: cat.order || 0
        });
        setIsCategoryModalOpen(true);
    };

    const handleDeleteCategory = async (catId) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette catégorie et tous ses candidats ?')) {
            try {
                await axios.delete(`${API_BASE}/api/ballondor/categories/${catId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Catégorie supprimée');
                if (selectedCategoryId === catId) {
                    setSelectedCategoryId(null);
                }
                fetchCategories();
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleResetVotes = async (catId) => {
        if (window.confirm('Réinitialiser les votes pour cette catégorie à zéro ?')) {
            try {
                await axios.post(`${API_BASE}/api/ballondor/categories/${catId}/reset-votes`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Votes réinitialisés avec succès');
                fetchCategories();
            } catch (err) {
                toast.error('Erreur lors de la réinitialisation');
            }
        }
    };

    // ---- CANDIDATE HANDLERS ----
    const openAddCandidateModal = () => {
        setEditingCandidate(null);
        setCandidateType('roster');
        setSelectedPlayerId('');
        setCandidateForm({
            name: '',
            position: '',
            number: '',
            bio: '',
            photo: null,
            photoUrl: '',
            playerId: ''
        });
        setIsCandidateModalOpen(true);
    };

    const openEditCandidateModal = (cand) => {
        setEditingCandidate(cand);
        setCandidateType(cand.playerId ? 'roster' : 'custom');
        setSelectedPlayerId(cand.playerId || '');
        setCandidateForm({
            name: cand.name || '',
            position: cand.position || '',
            number: cand.number || '',
            bio: cand.bio || '',
            photo: null,
            photoUrl: cand.photo || '',
            playerId: cand.playerId || ''
        });
        setIsCandidateModalOpen(true);
    };

    const handleRosterPlayerSelect = (playerId) => {
        setSelectedPlayerId(playerId);
        const player = players.find(p => p._id === playerId);
        if (player) {
            setCandidateForm(prev => ({
                ...prev,
                name: player.name || '',
                position: player.position || '',
                number: player.number !== undefined ? player.number : '',
                photoUrl: player.photo || '',
                playerId: player._id
            }));
        }
    };

    const handleCandidateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCategoryId) {
            toast.error('Veuillez sélectionner une catégorie');
            return;
        }

        const data = new FormData();
        data.append('name', candidateForm.name);
        data.append('position', candidateForm.position);
        data.append('number', candidateForm.number);
        data.append('bio', candidateForm.bio);
        if (candidateForm.playerId) data.append('playerId', candidateForm.playerId);

        if (candidateForm.photo) {
            data.append('photo', candidateForm.photo);
        } else if (candidateForm.photoUrl) {
            data.append('photo', candidateForm.photoUrl);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        };

        try {
            if (editingCandidate) {
                await axios.put(
                    `${API_BASE}/api/ballondor/categories/${selectedCategoryId}/candidates/${editingCandidate.id}`,
                    data,
                    config
                );
                toast.success('Candidat mis à jour');
            } else {
                await axios.post(
                    `${API_BASE}/api/ballondor/categories/${selectedCategoryId}/candidates`,
                    data,
                    config
                );
                toast.success('Candidat ajouté à la catégorie');
            }

            setIsCandidateModalOpen(false);
            setEditingCandidate(null);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement du candidat');
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        if (window.confirm('Retirer ce candidat de la catégorie ?')) {
            try {
                await axios.delete(
                    `${API_BASE}/api/ballondor/categories/${selectedCategoryId}/candidates/${candidateId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                toast.success('Candidat retiré');
                fetchCategories();
            } catch (err) {
                toast.error('Erreur lors du retrait du candidat');
            }
        }
    };

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />

            <div className="flex-grow ml-64 p-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center space-x-3">
                            <FaCrown className="text-amber-400 text-2xl" />
                            <h1 className="text-4xl font-black italic text-white uppercase">Ballon d'Or LK</h1>
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
                            Gestion des catégories de vote & désignation des candidats
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setCategoryForm({ title: '', description: '', status: 'active', order: categories.length });
                            setIsCategoryModalOpen(true);
                        }}
                        className="btn-primary space-x-2 bg-gradient-to-r from-amber-500 to-yellow-600 border-none text-black font-black"
                    >
                        <FaPlus />
                        <span>Créer une Catégorie</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-amber-400 rounded-full" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Categories Bar */}
                        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
                            {categories.map((cat) => {
                                const isSelected = activeCategory?._id === cat._id;
                                return (
                                    <div
                                        key={cat._id}
                                        onClick={() => setSelectedCategoryId(cat._id)}
                                        className={`cursor-pointer px-5 py-3.5 rounded-2xl border transition-all flex items-center space-x-3 whitespace-nowrap ${
                                            isSelected
                                                ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                                                : 'bg-card-bg border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <FaTrophy className={isSelected ? 'text-amber-400' : 'text-gray-500'} />
                                        <span className="font-black italic text-xs uppercase">{cat.title}</span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-300">
                                            {cat.candidates?.length || 0}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Active Category Admin Detail */}
                        {activeCategory ? (
                            <div className="card-gradient rounded-3xl p-8 border border-white/10 space-y-8">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-amber-400 font-black text-[10px] uppercase tracking-widest italic bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                                                Ordre: #{activeCategory.order || 0}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                                                activeCategory.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                Statut: {activeCategory.status === 'active' ? 'Actif' : 'Fermé'}
                                            </span>
                                        </div>

                                        <h2 className="text-3xl font-black italic uppercase text-white">
                                            {activeCategory.title}
                                        </h2>
                                        {activeCategory.description && (
                                            <p className="text-gray-400 text-sm mt-1">{activeCategory.description}</p>
                                        )}
                                    </div>

                                    {/* Category Actions */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={openAddCandidateModal}
                                            className="px-4 py-2.5 rounded-xl bg-primary-blue hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors"
                                        >
                                            <FaUserPlus />
                                            <span>Assigner un Candidat</span>
                                        </button>

                                        <button
                                            onClick={() => openEditCategoryModal(activeCategory)}
                                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                                            title="Modifier Catégorie"
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            onClick={() => handleResetVotes(activeCategory._id)}
                                            className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                                            title="Réinitialiser les votes"
                                        >
                                            <FaRedo />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteCategory(activeCategory._id)}
                                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                            title="Supprimer Catégorie"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                {/* Candidates Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-black italic uppercase text-white flex items-center space-x-2">
                                            <FaUsers className="text-amber-400" />
                                            <span>Candidats Inscrits ({activeCategory.candidates?.length || 0})</span>
                                        </h3>
                                    </div>

                                    {!activeCategory.candidates || activeCategory.candidates.length === 0 ? (
                                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 p-6">
                                            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                                Aucun candidat assigné à cette catégorie.
                                            </p>
                                            <button
                                                onClick={openAddCandidateModal}
                                                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 text-xs font-black uppercase tracking-wider inline-flex items-center space-x-2"
                                            >
                                                <FaPlus />
                                                <span>Ajouter le premier candidat</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {activeCategory.candidates.map((candidate) => (
                                                <div
                                                    key={candidate.id}
                                                    className="bg-dark-bg/80 border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:border-amber-500/40 transition-all"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                                                            <img
                                                                src={candidate.photo ? getImageUrl(candidate.photo) : '/images/hero.png'}
                                                                alt={candidate.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-black italic uppercase text-sm leading-tight">
                                                                {candidate.name}
                                                            </h4>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest italic">
                                                                    {candidate.position || 'Joueur'}
                                                                </span>
                                                                {candidate.number && (
                                                                    <>
                                                                        <span className="text-white/20">•</span>
                                                                        <span className="text-gray-400 text-[10px] font-bold">N° {candidate.number}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center space-x-1">
                                                                <FaTrophy className="text-[10px]" />
                                                                <span>{candidate.votes || 0} votes</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => openEditCandidateModal(candidate)}
                                                            className="p-2 bg-white/5 hover:bg-primary-blue text-white rounded-lg transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCandidate(candidate.id)}
                                                            className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-lg transition-colors"
                                                            title="Retirer"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 p-8">
                                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                    Veuillez créer ou sélectionner une catégorie pour gérer ses candidats.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* MODAL: CATEGORY CREATE / EDIT */}
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={22} />
                            </button>

                            <h2 className="text-2xl font-black italic text-white uppercase mb-6 flex items-center space-x-2">
                                <FaTrophy className="text-amber-400" />
                                <span>{editingCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}</span>
                            </h2>

                            <form onSubmit={handleCategorySubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                        Titre de la Catégorie *
                                    </label>
                                    <input
                                        type="text"
                                        value={categoryForm.title}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                                        placeholder="Ex: Meilleur Joueur de l'Année"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={categoryForm.description}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        placeholder="Description du trophée..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Statut des votes
                                        </label>
                                        <select
                                            value={categoryForm.status}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                        >
                                            <option value="active" className="bg-card-bg">Votes Ouverts (Actif)</option>
                                            <option value="closed" className="bg-card-bg">Votes Fermés</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Ordre d'affichage
                                        </label>
                                        <input
                                            type="number"
                                            value={categoryForm.order}
                                            onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
                                >
                                    {editingCategory ? 'Mettre à jour' : 'Créer la Catégorie'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* MODAL: CANDIDATE ASSIGNMENT */}
                {isCandidateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative my-8"
                        >
                            <button
                                onClick={() => setIsCandidateModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={22} />
                            </button>

                            <h2 className="text-2xl font-black italic text-white uppercase mb-6 flex items-center space-x-2">
                                <FaUserPlus className="text-amber-400" />
                                <span>{editingCandidate ? 'Modifier le Candidat' : 'Assigner un Candidat'}</span>
                            </h2>

                            {/* Candidate Type Toggle */}
                            {!editingCandidate && (
                                <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl mb-6 border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setCandidateType('roster')}
                                        className={`py-2.5 rounded-xl font-black text-xs uppercase transition-all ${
                                            candidateType === 'roster'
                                                ? 'bg-amber-500 text-black shadow-md'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Joueur de l'Équipe
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCandidateType('custom')}
                                        className={`py-2.5 rounded-xl font-black text-xs uppercase transition-all ${
                                            candidateType === 'custom'
                                                ? 'bg-amber-500 text-black shadow-md'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Candidat Personnalisé
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleCandidateSubmit} className="space-y-5">
                                {candidateType === 'roster' && !editingCandidate && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Sélectionner dans l'effectif du club
                                        </label>
                                        <select
                                            value={selectedPlayerId}
                                            onChange={(e) => handleRosterPlayerSelect(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                        >
                                            <option value="" className="bg-card-bg">-- Choisir un joueur --</option>
                                            {players.map((p) => (
                                                <option key={p._id} value={p._id} className="bg-card-bg">
                                                    {p.name} ({p.position} - N°{p.number})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Nom du candidat *
                                        </label>
                                        <input
                                            type="text"
                                            value={candidateForm.name}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Position / Poste
                                        </label>
                                        <input
                                            type="text"
                                            value={candidateForm.position}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                                            placeholder="Ex: Attaquant"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Numéro de maillot
                                        </label>
                                        <input
                                            type="text"
                                            value={candidateForm.number}
                                            onChange={(e) => setCandidateForm({ ...candidateForm, number: e.target.value })}
                                            placeholder="Ex: 10"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                            Photo (Fichier)
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => setCandidateForm({ ...candidateForm, photo: e.target.files[0] })}
                                            className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">
                                        Description / Palmarès / Stats
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={candidateForm.bio}
                                        onChange={(e) => setCandidateForm({ ...candidateForm, bio: e.target.value })}
                                        placeholder="Ex: 15 buts et 7 passes décisives cette saison"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-400 outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity mt-4"
                                >
                                    {editingCandidate ? 'Mettre à jour le candidat' : 'Valider et Assigner'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBallonDor;
