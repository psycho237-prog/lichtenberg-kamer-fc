import { API_BASE } from '../../services/api';
import React, { useState, useEffect } from 'react';
import Hero from '../../components/Home/Hero';
import NextMatch from '../../components/Home/NextMatch';
import { motion } from 'framer-motion';
import { stripHtml } from '../../utils/textUtils';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [news, setNews] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [nextMatch, setNextMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, pageRes, sponsorRes, matchesRes] = await Promise.all([
                    axios.get(API_BASE + '/api/news'),
                    axios.get(API_BASE + '/api/pages/home'),
                    axios.get(API_BASE + '/api/sponsors'),
                    axios.get(API_BASE + '/api/matches')
                ]);
                setNews(newsRes.data.slice(0, 3));
                setPageData(pageRes.data.content);
                setSponsors(sponsorRes.data);

                const upcoming = matchesRes.data.filter(m => m.status === 'upcoming' || m.status === 'ongoing')
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                setNextMatch(upcoming.length > 0 ? upcoming[0] : matchesRes.data[0]);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return null;

    return (
        <div className="bg-dark-bg pb-20">
            <Hero
                title={pageData?.heroTitle}
                subtitle={pageData?.heroSubtitle}
                seasonPeriod={pageData?.seasonPeriod}
            />
            <NextMatch match={nextMatch} />

            {/* About Section from CMS */}
            {pageData?.aboutContent && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary-blue font-black uppercase tracking-widest text-xs italic">Notre Histoire</span>
                            <h2 className="text-4xl md:text-6xl font-black italic text-white mt-4 mb-8 uppercase leading-none">
                                L'ADN DU <span className="text-primary-yellow">CLUB</span>
                            </h2>
                            <div
                                className="prose prose-invert prose-primary-blue max-w-none text-gray-400 font-semibold text-lg leading-relaxed ql-editor !p-0"
                                dangerouslySetInnerHTML={{ __html: pageData.aboutContent }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-video rounded-3xl overflow-hidden border border-white/10"
                        >
                            <img src="/images/hero.png" className="w-full h-full object-cover" alt="Club" />
                            <div className="absolute inset-0 bg-primary-blue/20 mix-blend-overlay"></div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Vision & Philosophy from CMS */}
            {(pageData?.visionContent || pageData?.philosophyContent) && (
                <section className="bg-clear py-32 mt-32 border-y border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-[150px] -mr-48 -mt-48"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {pageData.visionContent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="card-gradient rounded-3xl p-10 border border-white/5"
                                >
                                    <div className="w-16 h-1 w-24 bg-primary-yellow mb-8"></div>
                                    <h3 className="text-3xl font-black italic text-white uppercase italic mb-6">Notre <span className="text-primary-yellow">Vision</span></h3>
                                    <div
                                        className="prose prose-invert prose-primary-blue max-w-none text-gray-400 font-semibold leading-relaxed ql-editor !p-0"
                                        dangerouslySetInnerHTML={{ __html: pageData.visionContent }}
                                    />
                                </motion.div>
                            )}
                            {pageData.philosophyContent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="card-gradient rounded-3xl p-10 border border-white/5"
                                >
                                    <div className="w-16 h-1 w-24 bg-primary-blue mb-8"></div>
                                    <h3 className="text-3xl font-black italic text-white uppercase italic mb-6">Notre <span className="text-primary-blue">Philosophie</span></h3>
                                    <div
                                        className="prose prose-invert prose-primary-blue max-w-none text-gray-400 font-semibold leading-relaxed ql-editor !p-0"
                                        dangerouslySetInnerHTML={{ __html: pageData.philosophyContent }}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest News Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-primary-blue font-bold uppercase tracking-widest text-xs">Directement du centre d'entraînement</span>
                        <h2 className="text-4xl md:text-5xl font-black italic text-white mt-2">Dernières <span className="text-primary-yellow">Nouvelles</span></h2>
                    </div>
                    <Link to="/news" className="flex items-center space-x-2 text-primary-yellow font-bold uppercase text-sm hover:translate-x-2 transition-transform">
                        <span>Voir Tout</span>
                        <FaArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="card-gradient rounded-3xl overflow-hidden group border border-white/5"
                        >
                            <Link to={`/news/${item._id}`}>
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={item.image ? `${API_BASE}${item.image}` : '/images/hero.png'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-primary-blue text-white text-[10px] font-black italic px-3 py-1.5 rounded-full uppercase tracking-widest">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-4 italic">
                                        {new Date(item.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <h3 className="text-2xl font-black italic text-white group-hover:text-primary-blue transition-colors leading-tight mb-4 uppercase">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                                        {stripHtml(item.content)}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center text-white font-black italic text-xs uppercase group-hover:text-primary-blue transition-all">
                                        <span>Lire Plus</span>
                                        <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Sponsors Section */}
            {sponsors && sponsors.length > 0 && (
                <section className="bg-clear py-20 mt-32 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                            {sponsors.map(sponsor => (
                                <img
                                    key={sponsor._id}
                                    src={`${API_BASE}${sponsor.logo}`}
                                    alt={sponsor.name}
                                    className="h-12 w-auto object-contain"
                                    title={sponsor.name}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
