import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaChevronDown } from 'react-icons/fa';

import { Link } from 'react-router-dom';

const Hero = ({ title, subtitle, seasonPeriod, heroImage }) => {
    // Split title if it contains <br /> or custom marker if needed, 
    // or just use the first word for the big white part
    const mainTitle = title ? title.split(' ')[0] : 'LICHTENBERG';
    const highlightTitle = title ? title.split(' ').slice(1).join(' ') : 'KAMER e.V';

    return (
        <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url("${heroImage || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}")`,
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
                    <span className="inline-block px-4 py-1 mb-6 border-l-4 border-primary-yellow bg-primary-blue/20 text-primary-yellow font-bold uppercase tracking-widest text-xs sm:text-sm italic">
                        {seasonPeriod || 'Saison 2024 / 2025'}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic text-white leading-[0.9] mb-8 uppercase tracking-tighter">
                        {mainTitle} <br />
                        <span className="text-primary-yellow">{highlightTitle}</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed font-semibold max-w-2xl italic">
                        {subtitle || "L'ascension d'un club, la passion d'un peuple. Ensemble, vers les sommets du football camerounais."}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/gallery" className="btn-outline px-8 py-4 text-lg bg-white/5 border-white/20 hover:border-primary-blue inline-flex items-center group">
                            <FaPlay className="mr-3 text-sm group-hover:text-primary-blue transition-colors" /> Voir Highlights
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-1/3 h-full pointer-events-none hidden lg:block">
                <div className="h-full w-full bg-gradient-to-l from-primary-blue/10 to-transparent"></div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-28 md:bottom-32 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer pointer-events-auto"
                onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}
            >
                <span className="text-white/50 text-[10px] md:text-xs uppercase tracking-widest font-bold mb-2">Découvrir</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <FaChevronDown className="text-primary-yellow text-xl md:text-2xl" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
