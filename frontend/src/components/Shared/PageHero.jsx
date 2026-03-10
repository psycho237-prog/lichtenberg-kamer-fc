import React from 'react';
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, bgImage }) => {
    // Split title to highlight the last word in yellow
    const mainTitle = title ? title.split(' ').slice(0, -1).join(' ') : '';
    const highlightTitle = title ? title.split(' ').pop() : '';

    return (
        <div className="relative pt-32 pb-20 flex items-center overflow-hidden mb-12">
            {/* Background with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url("${bgImage}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-dark-bg/40"></div>
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-7xl font-black italic text-white leading-none mb-6 uppercase tracking-tighter">
                        {mainTitle} <span className="text-primary-yellow">{highlightTitle}</span>
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-gray-300 font-semibold max-w-2xl mx-auto italic">
                            {subtitle}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 w-1/3 h-full pointer-events-none hidden lg:block">
                <div className="h-full w-full bg-gradient-to-l from-primary-blue/10 to-transparent"></div>
            </div>
        </div>
    );
};

export default PageHero;
