import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
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
    const [visionExpanded, setVisionExpanded] = useState(false);
    const [philosophyExpanded, setPhilosophyExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, pageRes, sponsorRes, matchesRes] = await Promise.all([
                    axios.get(API_BASE + '/api/news'),
                    axios.get(API_BASE + '/api/pages/home'),
                    axios.get(API_BASE + '/api/sponsors'),
                    axios.get(API_BASE + '/api/matches')
                ]);
                const sortedNews = newsRes.data.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                setNews(sortedNews.slice(0, 3));
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
                heroImage={getImageUrl(pageData?.heroImage)}
            />
            <NextMatch match={nextMatch} />

            {/* About Section from CMS */}
            {pageData?.aboutContent && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
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
                            <img
                                src={pageData.aboutImage ? getImageUrl(pageData.aboutImage) : '/images/hero.png'}
                                className="w-full h-full object-cover"
                                alt="Club"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-primary-blue/20 mix-blend-overlay"></div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Vision & Philosophy from CMS */}
            {(pageData?.visionContent || pageData?.philosophyContent) && (
                <section className="bg-clear py-16 md:py-32 mt-16 md:mt-32 border-y border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/5 rounded-full blur-[150px] -mr-48 -mt-48"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full overflow-hidden">

                        <div className="flex items-center justify-end mb-4 md:hidden text-gray-500 text-[9px] font-bold uppercase tracking-widest relative z-20">
                            <span className="mr-2">Faites glisser</span>
                            <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                                <FaArrowRight />
                            </motion.div>
                        </div>

                        <div className="flex md:grid flex-nowrap md:grid-cols-2 gap-4 md:gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                            {pageData.visionContent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    onClick={() => setVisionExpanded(!visionExpanded)}
                                    className="card-gradient rounded-3xl p-8 md:p-10 border border-white/5 w-[85vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 snap-center cursor-pointer transition-all"
                                >
                                    <div className="w-16 h-1 bg-primary-yellow mb-4 md:mb-8"></div>
                                    <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase mb-4 md:mb-6">Notre <span className="text-primary-yellow">Vision</span></h3>
                                    <div className={`relative transition-all duration-500 ease-in-out md:max-h-none ${!visionExpanded ? 'max-h-[14rem] overflow-hidden' : 'max-h-[1000px] overflow-hidden'}`}>
                                        <div
                                            className="prose prose-invert prose-primary-blue max-w-none text-gray-400 font-semibold leading-relaxed ql-editor !p-0 ![overflow:hidden]"
                                            dangerouslySetInnerHTML={{ __html: pageData.visionContent }}
                                        />
                                        <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0b1324] to-transparent pointer-events-none md:hidden transition-opacity duration-300 ${visionExpanded ? 'opacity-0' : 'opacity-100'}`} />
                                    </div>
                                    <div className="text-primary-yellow text-[10px] font-bold uppercase tracking-widest mt-4 md:hidden text-center opacity-70">
                                        {visionExpanded ? '▼ Réduire' : '▶ Lire la suite'}
                                    </div>
                                </motion.div>
                            )}
                            {pageData.philosophyContent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    onClick={() => setPhilosophyExpanded(!philosophyExpanded)}
                                    className="card-gradient rounded-3xl p-8 md:p-10 border border-white/5 w-[85vw] max-w-[320px] md:max-w-none md:w-auto shrink-0 snap-center cursor-pointer transition-all"
                                >
                                    <div className="w-16 h-1 bg-primary-blue mb-4 md:mb-8"></div>
                                    <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase mb-4 md:mb-6">Notre <span className="text-primary-blue">Philosophie</span></h3>
                                    <div className={`relative transition-all duration-500 ease-in-out md:max-h-none ${!philosophyExpanded ? 'max-h-[14rem] overflow-hidden' : 'max-h-[1000px] overflow-hidden'}`}>
                                        <div
                                            className="prose prose-invert prose-primary-blue max-w-none text-gray-400 font-semibold leading-relaxed ql-editor !p-0 ![overflow:hidden]"
                                            dangerouslySetInnerHTML={{ __html: pageData.philosophyContent }}
                                        />
                                        <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0b1324] to-transparent pointer-events-none md:hidden transition-opacity duration-300 ${philosophyExpanded ? 'opacity-0' : 'opacity-100'}`} />
                                    </div>
                                    <div className="text-primary-blue text-[10px] font-bold uppercase tracking-widest mt-4 md:hidden text-center opacity-70">
                                        {philosophyExpanded ? '▼ Réduire' : '▶ Lire la suite'}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest News Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-32">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div>
                        <span className="text-primary-blue font-bold uppercase tracking-widest text-[10px] md:text-xs">Directement du centre</span>
                        <h2 className="text-3xl md:text-5xl font-black italic text-white mt-1 md:mt-2">Actus <span className="text-primary-yellow">Club</span></h2>
                    </div>
                    <Link to="/news" className="flex items-center space-x-1 md:space-x-2 text-primary-yellow font-bold uppercase text-[10px] md:text-sm hover:translate-x-2 transition-transform mb-1 md:mb-0">
                        <span>Voir Tout</span>
                        <FaArrowRight />
                    </Link>
                </div>

                <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                    {news.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="card-gradient rounded-2xl md:rounded-3xl overflow-hidden group border border-white/5 w-[75vw] max-w-[280px] md:max-w-none md:w-auto shrink-0 snap-center flex flex-col"
                        >
                            <Link to={`/news/${item._id}`} className="flex flex-col h-full">
                                <div className="relative h-36 md:h-64 overflow-hidden shrink-0">
                                    <img
                                        src={item.image ? getImageUrl(item.image) : '/images/hero.png'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary-blue text-white text-[8px] md:text-[10px] font-black italic px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-4 md:p-8 flex flex-col flex-1">
                                    <span className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest block mb-1 md:mb-4 italic">
                                        {new Date(item.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <h3 className="text-lg md:text-2xl font-black italic text-white group-hover:text-primary-blue transition-colors leading-[1.1] mb-2 md:mb-4 uppercase line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-[10px] md:text-sm line-clamp-2 md:line-clamp-3 mb-3 md:mb-6 flex-1 leading-snug">
                                        {stripHtml(item.content)}
                                    </p>
                                    <div className="mt-auto pt-3 md:pt-6 border-t border-white/5 flex items-center text-white font-black italic text-[10px] md:text-xs uppercase group-hover:text-primary-blue transition-all">
                                        <span>Lire Plus</span>
                                        <FaArrowRight className="ml-1.5 md:ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Sponsors Section */}
            {sponsors && sponsors.length > 0 && (
                <section className="bg-clear py-16 md:py-24 mt-16 md:mt-32 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12 md:mb-16">
                            <span className="text-primary-blue font-black uppercase tracking-widest text-[10px] md:text-xs italic">Ils nous soutiennent</span>
                            <h2 className="text-3xl md:text-5xl font-black italic text-white mt-2 uppercase">Nos Partenaires & <span className="text-primary-yellow">Sponsors</span></h2>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                            {sponsors.map(sponsor => (
                                <a
                                    key={sponsor._id}
                                    href={sponsor.website || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group transition-all duration-500 hover:scale-110 ${!sponsor.website ? 'pointer-events-none' : ''}`}
                                >
                                    <img
                                        src={getImageUrl(sponsor.logo)}
                                        alt={sponsor.name}
                                        className="h-24 md:h-36 w-auto object-contain"
                                        title={sponsor.name}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
