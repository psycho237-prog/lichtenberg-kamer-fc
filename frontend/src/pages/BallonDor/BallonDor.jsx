import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaCheckCircle, FaStar, FaCrown, FaVoteYea, FaFire, FaShareAlt, FaExternalLinkAlt } from 'react-icons/fa';

const BallonDor = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [userVotes, setUserVotes] = useState({}); // { categoryId: candidateId }
    const [votingInProgress, setVotingInProgress] = useState({});

    // Load saved votes from localStorage
    useEffect(() => {
        try {
            const savedVotes = localStorage.getItem('lk_ballondor_user_votes');
            if (savedVotes) {
                setUserVotes(JSON.parse(savedVotes));
            }
        } catch (e) {
            console.error('Error reading localStorage votes', e);
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/ballondor/categories`);
            setCategories(res.data || []);
            if (res.data && res.data.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(res.data[0]._id);
            }
            setLoading(false);
        } catch (err) {
            console.error('Erreur de chargement des catégories', err);
            toast.error('Erreur lors du chargement de la page Ballon d\'Or');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleVote = async (categoryId, candidateId, candidateName) => {
        if (userVotes[categoryId]) {
            toast.error('Vous avez déjà voté dans cette catégorie !');
            return;
        }

        setVotingInProgress(prev => ({ ...prev, [categoryId]: true }));

        try {
            const res = await axios.post(`${API_BASE}/api/ballondor/vote`, {
                categoryId,
                candidateId
            });

            // Update local votes record
            const updatedUserVotes = { ...userVotes, [categoryId]: candidateId };
            setUserVotes(updatedUserVotes);
            localStorage.setItem('lk_ballondor_user_votes', JSON.stringify(updatedUserVotes));

            // Update state with updated category
            if (res.data && res.data.category) {
                setCategories(prev =>
                    prev.map(cat => (cat._id === categoryId ? res.data.category : cat))
                );
            } else {
                fetchCategories();
            }

            toast.success(`Votre vote pour ${candidateName} a été comptabilisé ! 🏆`, {
                duration: 4000,
                style: {
                    background: '#1A1D24',
                    color: '#F3B404',
                    border: '1px solid #F3B404'
                }
            });
        } catch (err) {
            if (err.response?.status === 409 || err.response?.data?.alreadyVoted) {
                // Server says IP already voted → sync localStorage
                const updatedUserVotes = { ...userVotes, [categoryId]: candidateId };
                setUserVotes(updatedUserVotes);
                localStorage.setItem('lk_ballondor_user_votes', JSON.stringify(updatedUserVotes));
                toast.error('Vous avez déjà voté dans cette catégorie ! 🔒');
            } else {
                toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement du vote');
            }
        } finally {
            setVotingInProgress(prev => ({ ...prev, [categoryId]: false }));
        }
    };

    const currentCategory = categories.find(cat => cat._id === selectedCategoryId) || categories[0];

    // Compute total votes for candidate percentage calculation
    const getCategoryTotalVotes = (cat) => {
        if (!cat || !cat.candidates) return 0;
        return cat.candidates.reduce((sum, cand) => sum + (cand.votes || 0), 0);
    };

    return (
        <div className="bg-dark-bg min-h-screen pt-24 pb-20 text-white overflow-hidden">
            {/* Header Hero Section */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-10 left-1/3 w-64 h-64 bg-primary-blue/20 blur-[100px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-6 shadow-lg shadow-amber-500/10"
                >
                    <FaCrown className="text-amber-400 text-sm animate-bounce" />
                    <span>{t("Ballon d'Or LK • Vote Gratuit")}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="text-5xl md:text-7xl font-black italic uppercase tracking-tight text-white mb-6"
                >
                    {t("BALLON D'OR")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]">LK {new Date().getFullYear()}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-semibold uppercase tracking-wider leading-relaxed"
                >
                    {t("Élisez vos meilleurs joueurs de Lichtenberg-Kamer e.V pour chaque catégorie. Soutenez vos favoris en un clic !")}
                </motion.p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-amber-400 font-bold uppercase text-xs tracking-widest">Chargement...</p>
                </div>
            ) : categories.length === 0 ? (
                <div className="max-w-3xl mx-auto px-4 text-center py-16 card-gradient rounded-3xl border border-white/10 p-10">
                    <FaTrophy className="text-6xl text-amber-500/40 mx-auto mb-4" />
                    <h3 className="text-2xl font-black italic uppercase text-white mb-2">Aucune catégorie disponible</h3>
                    <p className="text-gray-400 text-sm">Les votes ouvriront très prochainement.</p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Selector Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => {
                            const isSelected = selectedCategoryId === category._id;
                            const isVoted = !!userVotes[category._id];
                            return (
                                <button
                                    key={category._id}
                                    onClick={() => setSelectedCategoryId(category._id)}
                                    className={`relative px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center space-x-3 border ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black border-amber-400 shadow-xl shadow-amber-500/25 scale-105'
                                            : 'bg-card-bg/80 text-gray-300 border-white/10 hover:border-amber-500/50 hover:text-white'
                                    }`}
                                >
                                    <FaTrophy className={`text-sm ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                                    <span>{category.title}</span>
                                    {isVoted && (
                                        <span className={`p-1 rounded-full text-[10px] ${isSelected ? 'bg-black text-amber-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            <FaCheckCircle />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Category Header & Details */}
                    {currentCategory && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentCategory._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                <div className="bg-card-bg/60 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none" />
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest rounded-md">
                                                {t("Catégorie Officielle")}
                                            </span>
                                            {currentCategory.status === 'active' ? (
                                                <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                                                    {t("Votes Ouverts")}
                                                </span>
                                            ) : (
                                                <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">
                                                    {t("Votes Fermés")}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-3xl font-black italic uppercase text-white mb-2">
                                            {currentCategory.title}
                                        </h2>
                                        {currentCategory.description && (
                                            <p className="text-gray-400 text-sm max-w-2xl font-medium">
                                                {currentCategory.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                        <FaVoteYea className="text-3xl text-amber-400" />
                                        <div>
                                            <div className="text-2xl font-black text-white italic leading-none">
                                                {getCategoryTotalVotes(currentCategory).toLocaleString('fr-FR')}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                                                {t("Votes Enregistrés")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Candidates Grid */}
                                {!currentCategory.candidates || currentCategory.candidates.length === 0 ? (
                                    <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 p-8">
                                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                            Aucun candidat n'a encore été assigné à cette catégorie.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(() => {
                                            const totalVotes = getCategoryTotalVotes(currentCategory);
                                            const hasVotedThisCat = !!userVotes[currentCategory._id];
                                            const votedCandidateId = userVotes[currentCategory._id];

                                            // Find highest vote candidate for leader badge
                                            const maxVotes = Math.max(...currentCategory.candidates.map(c => c.votes || 0));

                                            return currentCategory.candidates.map((candidate, idx) => {
                                                const votes = candidate.votes || 0;
                                                const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
                                                const isVoted = votedCandidateId === candidate.id;
                                                const isLeader = votes > 0 && votes === maxVotes;

                                                return (
                                                    <motion.div
                                                        key={candidate.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                                                        className={`relative group rounded-3xl overflow-hidden bg-card-bg border transition-all duration-300 flex flex-col justify-between ${
                                                            isVoted
                                                                ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-2xl shadow-amber-500/20'
                                                                : 'border-white/10 hover:border-amber-500/40 hover:shadow-xl'
                                                        }`}
                                                    >
                                                        {/* Top Ribbon / Badges */}
                                                        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                                                            {candidate.number && (
                                                                <span className="px-3 py-1 bg-black/70 backdrop-blur-md border border-white/20 rounded-xl text-amber-400 font-black italic text-xs tracking-wider">
                                                                    N° {candidate.number}
                                                                </span>
                                                            )}
                                                            {isLeader && (
                                                                <span className="ml-auto px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg flex items-center space-x-1">
                                                                    <FaFire className="text-xs" />
                                                                    <span>{t("En Tête")}</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Candidate Image Container */}
                                                        <Link to={`/ballon-dor/candidate/${candidate.id}`} className="relative h-72 w-full overflow-hidden bg-white/5 block group-hover:opacity-95 transition-opacity cursor-pointer">
                                                            <img
                                                                src={candidate.photo ? getImageUrl(candidate.photo) : '/images/hero.png'}
                                                                alt={candidate.name}
                                                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-card-bg/30 to-transparent" />
                                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-amber-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 backdrop-blur-md">
                                                                <span>{t("Voir Profil & Partager")}</span>
                                                                <FaExternalLinkAlt className="text-[10px]" />
                                                            </div>
                                                        </Link>

                                                        {/* Candidate Information */}
                                                        <div className="p-6 pt-0 flex-grow flex flex-col justify-between space-y-6">
                                                            <div>
                                                                <div className="flex items-center justify-between text-primary-yellow font-black text-[10px] uppercase tracking-widest italic mb-1">
                                                                    <span>{candidate.position || 'Joueur LK'}</span>
                                                                    <Link to={`/ballon-dor/candidate/${candidate.id}`} className="text-gray-400 hover:text-amber-400 flex items-center space-x-1 text-[10px] lowercase font-semibold">
                                                                        <span>{t("Partager")}</span>
                                                                        <FaShareAlt className="text-[10px]" />
                                                                    </Link>
                                                                </div>

                                                                <Link to={`/ballon-dor/candidate/${candidate.id}`}>
                                                                    <h3 className="text-2xl font-black italic uppercase text-white leading-tight hover:text-amber-400 transition-colors">
                                                                        {candidate.name}
                                                                    </h3>
                                                                </Link>

                                                                {candidate.bio && (
                                                                    <p className="text-gray-400 text-xs font-medium mt-2 line-clamp-2">
                                                                        {candidate.bio}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Voting Stats & Progress Bar */}
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between items-end text-xs font-black uppercase">
                                                                    <span className="text-gray-400 tracking-wider">{t("Score actuel")}</span>
                                                                    <span className="text-amber-400 font-bold text-sm">{percentage}% <span className="text-gray-500 text-xs">({votes} votes)</span></span>
                                                                </div>

                                                                {/* Progress Bar */}
                                                                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${percentage}%` }}
                                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                                                                    />
                                                                </div>

                                                                {/* Buttons: Vote + Share/Profile */}
                                                                <div className="space-y-2">
                                                                    {isVoted ? (
                                                                        <div className="w-full py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2">
                                                                            <FaCheckCircle className="text-amber-400 text-sm" />
                                                                            <span>{t("VOTÉ POUR CE CANDIDAT")}</span>
                                                                        </div>
                                                                    ) : hasVotedThisCat ? (
                                                                        <button
                                                                            disabled
                                                                            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-black text-xs uppercase tracking-wider cursor-not-allowed text-center"
                                                                        >
                                                                            {t("Vote effectué dans cette catégorie")}
                                                                        </button>
                                                                    ) : currentCategory.status !== 'active' ? (
                                                                        <button
                                                                            disabled
                                                                            className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-black text-xs uppercase tracking-wider cursor-not-allowed text-center"
                                                                        >
                                                                            {t("Votes clôturés")}
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleVote(currentCategory._id, candidate.id, candidate.name)}
                                                                            disabled={votingInProgress[currentCategory._id]}
                                                                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                                                                        >
                                                                            <FaVoteYea className="text-base" />
                                                                            <span>{t("VOTER POUR")} {candidate.name.split(' ')[0]}</span>
                                                                        </button>
                                                                    )}

                                                                    <Link
                                                                        to={`/ballon-dor/candidate/${candidate.id}`}
                                                                        className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-amber-400 font-black text-[11px] uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors block text-center"
                                                                    >
                                                                        <FaShareAlt className="text-xs" />
                                                                        <span>{t("Voir Profil & Partager")}</span>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            });
                                        })()}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            )}
        </div>
    );
};

export default BallonDor;
