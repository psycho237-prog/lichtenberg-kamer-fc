import { API_BASE } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { stripHtml } from '../../utils/textUtils';
import PageHero from '../../components/Shared/PageHero';

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/news');
                const sortedNews = res.data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                setNews(sortedNews);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-blue"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <PageHero
                title="ACTUALITÉS DU CLUB"
                subtitle="Dernières nouvelles, résultats et coulisses du Lichtenberg-Kamer e.V."
                bgImage="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card-gradient rounded-xl md:rounded-3xl overflow-hidden group border border-white/5 flex flex-col"
                        >
                            <Link to={`/news/${item._id}`} className="flex flex-col h-full">
                                <div className="relative h-28 md:h-64 overflow-hidden shrink-0">
                                    <img
                                        src={item.image ? `${API_BASE}${item.image}` : '/images/hero.png'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary-blue text-white text-[7px] md:text-[10px] font-black px-2 py-0.5 md:px-3 rounded-full uppercase tracking-widest italic md:py-1">
                                        {item.category || 'Club'}
                                    </div>
                                </div>
                                <div className="p-3 md:p-8 flex flex-col flex-1">
                                    <div className="text-gray-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-1 md:mb-3">
                                        {new Date(item.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <h3 className="text-sm md:text-xl font-black italic text-white uppercase mb-2 md:mb-4 leading-tight group-hover:text-primary-blue transition-colors line-clamp-3 md:line-clamp-none">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-[9px] md:text-sm line-clamp-2 md:line-clamp-3 mb-2 md:mb-6 flex-1 leading-snug">
                                        {stripHtml(item.content)}
                                    </p>
                                    <div className="mt-auto pt-2 md:pt-4 border-t border-white/5 text-white font-black italic uppercase text-[9px] md:text-xs tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center space-x-1 md:space-x-2">
                                        <span>Lire</span>
                                        <span className="text-primary-blue text-sm md:text-lg">→</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {news.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl italic">Aucun article disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsList;
