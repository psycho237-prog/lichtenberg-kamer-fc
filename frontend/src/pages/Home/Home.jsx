import React from 'react';
import Hero from '../../components/Home/Hero';
import NextMatch from '../../components/Home/NextMatch';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const news = [
        {
            id: 1,
            title: "Recrutement: Onana Legrand rejoint le club",
            category: "TRANSFERT",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            date: "12 Oct 2024"
        },
        {
            id: 2,
            title: "Tactique: Comment nous avons battu Canon",
            category: "MATCH REVIEW",
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            date: "10 Oct 2024"
        },
        {
            id: 3,
            title: "Interview: Le coach parle du prochain derby",
            category: "PRESS CONF",
            image: "https://images.unsplash.com/photo-1510051646653-c33c63665b1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            date: "08 Oct 2024"
        }
    ];

    return (
        <div className="bg-dark-bg pb-20">
            <Hero />
            <NextMatch />

            {/* Latest News Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-primary-blue font-bold uppercase tracking-widest text-xs">Directement du centre d'entraînement</span>
                        <h2 className="text-4xl md:text-5xl font-black italic text-white mt-2">Dernières <span className="text-primary-yellow">Nouvelles</span></h2>
                    </div>
                    <button className="flex items-center space-x-2 text-primary-yellow font-bold uppercase text-sm hover:translate-x-2 transition-transform">
                        <span>Voir Tout</span>
                        <FaArrowRight />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="card-gradient rounded-lg overflow-hidden group cursor-pointer"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-primary-blue text-white text-[10px] font-black italic px-3 py-1 uppercase">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-3">{item.date}</span>
                                <h3 className="text-xl font-bold italic text-white group-hover:text-primary-yellow transition-colors leading-tight mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2">
                                    Découvrez les coulisses de la préparation de notre équipe pour le prochain match de championnat...
                                </p>
                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center text-primary-blue font-black italic text-xs uppercase group-hover:translate-x-1 transition-transform">
                                    Lire Plus <FaArrowRight className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Sponsors Section */}
            <section className="bg-white/5 py-20 mt-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-4xl font-black italic text-white tracking-widest">NIKE</span>
                        <span className="text-4xl font-black italic text-white tracking-widest">MTN</span>
                        <span className="text-4xl font-black italic text-white tracking-widest">ORANGE</span>
                        <span className="text-4xl font-black italic text-white tracking-widest">TOTAL</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
