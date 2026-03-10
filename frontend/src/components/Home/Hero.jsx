import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaTicketAlt } from 'react-icons/fa';

const Hero = () => {
    return (
        <div className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <span className="inline-block px-4 py-1 mb-6 border-l-4 border-primary-yellow bg-primary-blue/20 text-primary-yellow font-bold uppercase tracking-widest text-sm">
                        Saison 2024 / 2025
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black italic text-white leading-none mb-8">
                        LICHTENBERG <br />
                        <span className="text-primary-yellow">KAMER FC</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed font-semibold max-w-2xl">
                        L'ascension d'un club, la passion d'un peuple. Ensemble, vers les sommets du football camerounais.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="btn-primary px-8 py-4 text-lg">
                            <FaTicketAlt className="mr-3" /> Acheter Billets
                        </button>
                        <button className="btn-outline px-8 py-4 text-lg bg-white/5 border-white/20 hover:border-primary-blue">
                            <FaPlay className="mr-3 text-sm" /> Voir Highlights
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-1/3 h-full pointer-events-none hidden lg:block">
                <div className="h-full w-full bg-gradient-to-l from-primary-blue/10 to-transparent"></div>
            </div>
        </div>
    );
};

export default Hero;
