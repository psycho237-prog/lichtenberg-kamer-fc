import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    FaCrown, FaTrophy, FaVoteYea, FaCheckCircle, FaShareAlt,
    FaCopy, FaWhatsapp, FaFacebook, FaTwitter, FaArrowLeft, FaFire
} from 'react-icons/fa';

const CandidateProfile = () => {
    const { candidateId } = useParams();
    const [candidateData, setCandidateData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userVotes, setUserVotes] = useState({});
    const [voting, setVoting] = useState(false);
    const [copied, setCopied] = useState(false);

    // Read localStorage votes
    useEffect(() => {
        try {
            const saved = localStorage.getItem('lk_ballondor_user_votes');
            if (saved) setUserVotes(JSON.parse(saved));
        } catch (e) {
            console.error(e);
        }
    }, []);

    const fetchCandidateDetails = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/ballondor/candidate/${candidateId}`);
            setCandidateData(res.data.candidate);
            setCategoryData(res.data.category);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('Candidat introuvable');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (candidateId) {
            fetchCandidateDetails();
        }
    }, [candidateId]);

    const handleVote = async () => {
        if (!categoryData || !candidateData) return;

        if (userVotes[categoryData._id]) {
            toast.error('Vous avez déjà voté dans cette catégorie !');
            return;
        }

        setVoting(true);

        try {
            const res = await axios.post(`${API_BASE}/api/ballondor/vote`, {
                categoryId: categoryData._id,
                candidateId: candidateData.id
            });

            // Update user vote history
            const updated = { ...userVotes, [categoryData._id]: candidateData.id };
            setUserVotes(updated);
            localStorage.setItem('lk_ballondor_user_votes', JSON.stringify(updated));

            // Refresh candidate vote state
            if (res.data && res.data.category) {
                const updatedCand = (res.data.category.candidates || []).find(c => c.id === candidateId);
                if (updatedCand) setCandidateData(updatedCand);
                setCategoryData(res.data.category);
            } else {
                fetchCandidateDetails();
            }

            toast.success(`Votre vote pour ${candidateData.name} a été comptabilisé ! 🏆`, {
                style: { background: '#1A1D24', color: '#F3B404', border: '1px solid #F3B404' }
            });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors du vote');
        } finally {
            setVoting(false);
        }
    };

    const shareUrl = window.location.href;
    const shareMessage = candidateData && categoryData
        ? `Votez pour ${candidateData.name} dans la catégorie "${categoryData.title}" du Ballon d'Or LK 2026 ! 🏆`
        : `Votez au Ballon d'Or LK 2026 !`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Lien de vote copié ! Partagez-le avec votre communauté');
        setTimeout(() => setCopied(false), 3000);
    };

    if (loading) {
        return (
            <div className="bg-dark-bg min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-amber-400 font-bold uppercase text-xs tracking-widest">Chargement du profil candidat...</p>
            </div>
        );
    }

    if (!candidateData || !categoryData) {
        return (
            <div className="bg-dark-bg min-h-screen pt-32 pb-20 text-white text-center">
                <div className="max-w-md mx-auto px-4">
                    <FaTrophy className="text-6xl text-amber-500/40 mx-auto mb-4" />
                    <h2 className="text-2xl font-black italic uppercase mb-4">Candidat non trouvé</h2>
                    <Link to="/ballon-dor" className="btn-primary inline-flex items-center space-x-2">
                        <FaArrowLeft />
                        <span>Retour au Ballon d'Or</span>
                    </Link>
                </div>
            </div>
        );
    }

    const totalCategoryVotes = (categoryData.candidates || []).reduce((sum, c) => sum + (c.votes || 0), 0);
    const votes = candidateData.votes || 0;
    const percentage = totalCategoryVotes > 0 ? ((votes / totalCategoryVotes) * 100).toFixed(1) : 0;
    const hasVotedThisCat = !!userVotes[categoryData._id];
    const isVotedForThisCand = userVotes[categoryData._id] === candidateData.id;

    return (
        <div className="bg-dark-bg min-h-screen pt-28 pb-20 text-white relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Navigation Back */}
                <Link
                    to="/ballon-dor"
                    className="inline-flex items-center space-x-2 text-gray-400 hover:text-amber-400 font-black text-xs uppercase tracking-widest transition-colors mb-8"
                >
                    <FaArrowLeft />
                    <span>Retour au Ballon d'Or LK</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Image Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-5 relative group rounded-3xl overflow-hidden bg-card-bg border border-amber-500/30 shadow-2xl shadow-amber-500/10"
                    >
                        {candidateData.number && (
                            <span className="absolute top-4 left-4 z-10 px-3.5 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-amber-400 font-black italic text-sm tracking-wider">
                                N° {candidateData.number}
                            </span>
                        )}

                        <div className="relative h-96 sm:h-[450px] w-full overflow-hidden bg-white/5">
                            <img
                                src={candidateData.photo ? getImageUrl(candidateData.photo) : '/images/hero.png'}
                                alt={candidateData.name}
                                className="w-full h-full object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-transparent to-transparent" />
                        </div>

                        <div className="p-6 text-center border-t border-white/10 bg-card-bg">
                            <span className="text-amber-400 font-black text-xs uppercase tracking-widest italic block mb-1">
                                {candidateData.position || 'Joueur LK'}
                            </span>
                            <h1 className="text-3xl font-black italic uppercase text-white leading-tight">
                                {candidateData.name}
                            </h1>
                        </div>
                    </motion.div>

                    {/* Right Column: Profile & Voting Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        {/* Category Banner */}
                        <div className="bg-card-bg/80 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                            <div className="flex items-center space-x-2 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                <FaCrown />
                                <span>Catégorie Officielle</span>
                            </div>
                            <h2 className="text-2xl font-black italic uppercase text-white">
                                {categoryData.title}
                            </h2>
                            {categoryData.description && (
                                <p className="text-gray-400 text-xs mt-1">{categoryData.description}</p>
                            )}
                        </div>

                        {/* Bio & Stats */}
                        <div className="bg-card-bg/80 border border-white/10 rounded-3xl p-6 space-y-6">
                            <h3 className="text-lg font-black italic uppercase text-white flex items-center space-x-2">
                                <FaTrophy className="text-amber-400" />
                                <span>Présentation & Statistiques</span>
                            </h3>

                            {candidateData.bio ? (
                                <p className="text-gray-300 text-sm leading-relaxed font-medium">
                                    {candidateData.bio}
                                </p>
                            ) : (
                                <p className="text-gray-500 text-xs italic">
                                    Nominé officiel au Ballon d'Or LK 2026 pour le club Lichtenberg-Kamer e.V.
                                </p>
                            )}

                            {/* Live Vote Progress */}
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex justify-between items-end text-xs font-black uppercase">
                                    <span className="text-gray-400">Pourcentage des suffrages</span>
                                    <span className="text-amber-400 text-base font-black">{percentage}% <span className="text-gray-500 text-xs font-bold">({votes} votes)</span></span>
                                </div>

                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Vote CTA Button */}
                            {isVotedForThisCand ? (
                                <div className="w-full py-4 px-6 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-3 shadow-lg">
                                    <FaCheckCircle className="text-amber-400 text-lg" />
                                    <span>VOUS AVEZ VOTÉ POUR CE CANDIDAT</span>
                                </div>
                            ) : hasVotedThisCat ? (
                                <div className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black text-xs uppercase tracking-wider text-center">
                                    Vote déjà effectué dans cette catégorie
                                </div>
                            ) : categoryData.status !== 'active' ? (
                                <div className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black text-xs uppercase tracking-wider text-center">
                                    Les votes pour cette catégorie sont clôturés
                                </div>
                            ) : (
                                <button
                                    onClick={handleVote}
                                    disabled={voting}
                                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 flex items-center justify-center space-x-3 active:scale-98 cursor-pointer"
                                >
                                    <FaVoteYea className="text-lg" />
                                    <span>VOTER POUR {candidateData.name}</span>
                                </button>
                            )}
                        </div>

                        {/* SHARE & COMMUNITY PROMOTION BOX */}
                        <div className="bg-gradient-to-br from-amber-500/10 via-card-bg to-card-bg border border-amber-500/30 rounded-3xl p-6 space-y-5">
                            <div className="flex items-center space-x-3">
                                <FaShareAlt className="text-amber-400 text-xl" />
                                <div>
                                    <h4 className="text-lg font-black italic uppercase text-white leading-tight">
                                        Partagez le lien avec votre communauté
                                    </h4>
                                    <p className="text-gray-400 text-xs font-semibold">
                                        Aidez {candidateData.name} à récolter le maximum de votes !
                                    </p>
                                </div>
                            </div>

                            {/* Link Box */}
                            <div className="flex items-center space-x-2 bg-dark-bg/80 border border-white/10 rounded-2xl p-2.5">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="bg-transparent text-gray-300 text-xs font-mono px-3 flex-grow outline-none truncate"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="px-4 py-2 bg-amber-500 text-black font-black text-xs uppercase rounded-xl flex items-center space-x-1.5 hover:bg-amber-400 transition-colors"
                                >
                                    <FaCopy />
                                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                                </button>
                            </div>

                            {/* Quick Social Buttons */}
                            <div className="grid grid-cols-3 gap-3">
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage + ' ' + shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-3 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 font-bold text-xs uppercase flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <FaWhatsapp className="text-base" />
                                    <span>WhatsApp</span>
                                </a>

                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-3 px-4 rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-400 font-bold text-xs uppercase flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <FaFacebook className="text-base" />
                                    <span>Facebook</span>
                                </a>

                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="py-3 px-4 rounded-xl bg-sky-600/20 border border-sky-500/30 hover:bg-sky-600/30 text-sky-400 font-bold text-xs uppercase flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <FaTwitter className="text-base" />
                                    <span>Twitter</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
