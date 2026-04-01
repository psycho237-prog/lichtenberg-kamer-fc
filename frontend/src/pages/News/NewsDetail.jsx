import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaShareAlt, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const NewsDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    const [likesCount, setLikesCount] = useState(0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/news/${id}`);
                setArticle(res.data);
                setLikesCount(res.data.likes ? res.data.likes.length : 0);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    const handleLike = async () => {
        const email = prompt("Veuillez entrer votre adresse email pour liker cet article.\n\nNote: Vous devez être abonné à la newsletter.");
        if (!email) return;

        setIsLiking(true);
        try {
            const res = await axios.post(`${API_BASE}/api/news/${id}/like`, { email });
            setLikesCount(res.data.likes.length);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Erreur lors du like.");
        } finally {
            setIsLiking(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-blue"></div>
        </div>
    );

    if (!article) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
            <p className="text-2xl italic">Article non trouvé.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            {/* Header Hero */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={article.image ? getImageUrl(article.image) : '/images/hero.png'}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent"></div>

                <div className="absolute bottom-12 left-0 w-full px-4">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-primary-blue text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic inline-block mb-6 shadow-xl"
                        >
                            {article.category || 'Actualité'}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black italic text-white uppercase italic leading-tight"
                        >
                            {article.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap items-center gap-8 mt-8 text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                        >
                            <div className="flex items-center space-x-2">
                                <FaCalendarAlt className="text-primary-blue text-sm" />
                                <span>{new Date(article.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FaUser className="text-primary-blue text-sm" />
                                <span>Par {article.author || 'Lichtenberg-Kamer e.V'}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card-bg border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
                >
                    <div
                        className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed ql-editor !p-0"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <div className="mt-12 pt-12 border-t border-white/5 flex justify-between items-center">
                        <Link
                            to="/news"
                            className="text-white font-black italic uppercase text-xs tracking-widest hover:text-primary-blue transition-colors flex items-center space-x-2"
                        >
                            <span className="text-primary-blue text-lg">←</span>
                            <span>Retour aux articles</span>
                        </Link>

                        <div className="flex items-center space-x-3">
                            <span className="text-gray-500 font-black uppercase text-[10px] tracking-widest hidden sm:block">Actions :</span>

                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                disabled={isLiking}
                                className="p-3 bg-white/5 hover:bg-red-500/20 text-white rounded-xl transition-all flex items-center space-x-2 group border border-white/5"
                                title="Liker l'article"
                            >
                                <FaHeart className={`transition-colors ${isLiking ? 'text-gray-500' : 'text-red-500 group-hover:scale-110'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                    {likesCount > 0 ? likesCount : 'Liker'}
                                </span>
                            </button>

                            {/* Share Button */}
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: article.title,
                                            text: `Découvrez cet article sur Lichtenberg-Kamer e.V : ${article.title}`,
                                            url: window.location.href,
                                        }).catch(err => console.log('Erreur de partage:', err));
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        toast.success('Lien copié dans le presse-papier !');
                                    }
                                }}
                                className="p-3 bg-white/5 hover:bg-primary-blue text-white rounded-xl transition-all flex items-center space-x-2 group border border-white/5"
                                title="Partager l'article"
                            >
                                <FaShareAlt className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Partager</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NewsDetail;
