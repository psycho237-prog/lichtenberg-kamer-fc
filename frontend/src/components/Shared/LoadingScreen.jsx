import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFutbol } from 'react-icons/fa';

const LoadingScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                setTimeout(onComplete, 800); // Wait for exit animation
            }
        }, 2000); // 2 seconds loading duration

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-dark-bg flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-primary-blue/5"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-yellow/10 rounded-full blur-[100px]"></div>

                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 360]
                        }}
                        transition={{
                            y: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                        }}
                        className="text-white text-7xl md:text-8xl mb-8 relative z-10"
                    >
                        <FaFutbol className="drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black italic text-white uppercase tracking-widest relative z-10 text-center px-4 leading-tight"
                    >
                        Lichtenberg <br className="sm:hidden" /> <span className="text-primary-yellow">Kamer e.V</span>
                    </motion.h2>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-1 bg-primary-blue mt-8 relative z-10 overflow-hidden rounded-full"
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-1/2 h-full bg-primary-yellow"
                        ></motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
