import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaShareAlt } from 'react-icons/fa';

const NewsDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/news/${id}`);
                setArticle(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

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
                    src={article.image ? `http://localhost:5000${article.image}` : '/images/hero.png'}
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
                                <span>Par {article.author || 'Lichtenberg-Kamer FC'}</span>
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

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Partager :</span>
                            <button className="text-gray-400 hover:text-white transition-colors text-lg"><FaShareAlt /></button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default NewsDetail;
