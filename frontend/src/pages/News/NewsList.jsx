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
                const res = await axios.get('http://localhost:5000/api/news');
                setNews(res.data);
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
                subtitle="Dernières nouvelles, résultats et coulisses du Lichtenberg-Kamer FC."
                bgImage="https://images.unsplash.com/photo-1508344928928-7165b67de128?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card-gradient rounded-2xl overflow-hidden group border border-white/5"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image ? `http://localhost:5000${item.image}` : '/images/hero.png'}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-primary-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">
                                    {item.category || 'Club'}
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">
                                    {new Date(item.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <h3 className="text-xl font-black italic text-white uppercase italic mb-4 leading-tight group-hover:text-primary-blue transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                                    {stripHtml(item.content)}
                                </p>
                                <Link
                                    to={`/news/${item._id}`}
                                    className="text-white font-black italic uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform inline-flex items-center space-x-2"
                                >
                                    <span>Lire la suite</span>
                                    <span className="text-primary-blue text-lg">→</span>
                                </Link>
                            </div>
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
