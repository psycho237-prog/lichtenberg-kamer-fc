import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLang, setShowLang] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('Home'), path: '/' },
        { name: t('Équipe'), path: '/team' },
        { name: t('Matchs'), path: '/matches' },
        { name: t('Actualités'), path: '/news' },
        { name: t('Galerie'), path: '/gallery' },
        { name: t('Contact'), path: '/contact' },
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setShowLang(false);
    };

    const languages = [
        { code: 'fr', name: 'FR', flag: '🇫🇷' },
        { code: 'en', name: 'EN', flag: '🇺🇸' },
        { code: 'de', name: 'DE', flag: '🇩🇪' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-dark-bg/95 backdrop-blur-md py-2 border-b border-white/10' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/images/logo.png" alt="LK Logo" className="h-12 w-auto" />
                        <span className="text-xl font-bold italic text-white hidden sm:block">
                            LICHTENBERG-<span className="text-primary-yellow">KAMER</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${location.pathname === link.path ? 'text-primary-yellow underline underline-offset-8' : 'text-white hover:text-primary-yellow'}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLang(!showLang)}
                                className="flex items-center space-x-1 text-white hover:text-primary-yellow transition-colors font-bold text-xs uppercase"
                            >
                                <FaGlobe className="text-sm" />
                                <span>{i18n.language?.split('-')[0].toUpperCase()}</span>
                            </button>

                            {showLang && (
                                <div className="absolute right-0 mt-2 w-32 bg-card-bg border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-primary-blue transition-colors flex items-center justify-between"
                                        >
                                            <span>{lang.name}</span>
                                            <span>{lang.flag}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/tickets" className="btn-primary">
                            {t('Tickets')}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white p-2"
                        >
                            {isOpen ? <HiX className="h-8 w-8" /> : <HiMenu className="h-8 w-8" size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-dark-bg border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-4 text-white font-bold uppercase border-b border-white/5"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4">
                        <Link to="/tickets" className="btn-primary w-full justify-center">
                            Tickets
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
