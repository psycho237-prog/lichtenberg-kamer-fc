import { API_BASE } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
    const [settings, setSettings] = useState(null);
    const [contactData, setContactData] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [settingsRes, contactRes] = await Promise.all([
                    axios.get(API_BASE + '/api/pages/settings'),
                    axios.get(API_BASE + '/api/pages/contact')
                ]);
                if (settingsRes.data && settingsRes.data.content) setSettings(settingsRes.data.content);
                if (contactRes.data && contactRes.data.content) setContactData(contactRes.data.content);
            } catch (err) {
                console.error("Erreur chargement footer:", err);
            }
        };
        fetchSettings();
    }, []);
    return (
        <footer className="bg-dark-bg border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Club Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <img src="/images/logo.png" alt="LK Logo" className="h-12 w-auto" />
                            <span className="text-xl font-bold italic text-white">
                                LICHTENBERG-<span className="text-primary-yellow">KAMER</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Lichtenberg-Kamer e.V. est bien plus qu'un club. C'est une famille, une ambition et l'excellence au service du football. Rejoignez l'aventure.
                        </p>
                        <div className="flex space-x-4">
                            {settings?.facebook && (
                                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-primary-blue transition-colors">
                                    <FaFacebook className="text-white" />
                                </a>
                            )}
                            {settings?.instagram && (
                                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-pink-500 transition-colors">
                                    <FaInstagram className="text-white" />
                                </a>
                            )}
                            {settings?.twitter && (
                                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-full hover:bg-blue-400 transition-colors">
                                    <FaTwitter className="text-white" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Navigation</h3>
                        <ul className="space-y-4">
                            {['Home', 'Équipe', 'Matchs', 'Actualités', 'Galerie', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-primary-yellow transition-colors flex items-center">
                                        <span className="mr-2">›</span> {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <FaMapMarkerAlt className="mt-1 text-primary-blue" />
                                <span>{contactData?.address || "Stadium Road, Yaoundé, Cameroun"}</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <FaEnvelope className="text-primary-blue" />
                                <span>{contactData?.email || "contact@lichtenberg-kamer.de"}</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <FaPhone className="text-primary-blue" />
                                <span>{contactData?.phone || "+237 600 000 000"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-6">Newsletter</h3>
                        <p className="text-gray-400 text-sm mb-4">Abonnez-vous pour recevoir les dernières infos.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Votre Email"
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-primary-blue text-white"
                            />
                            <button className="btn-primary w-full justify-center py-3">
                                S'abonner
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col items-center justify-center text-gray-500 text-sm space-y-4">
                    <p>© 2024 LICHTENBERG-KAMER e.V. TOUS DROITS RÉSERVÉS.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
                        <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-4 tracking-widest uppercase">
                        Développé par <a href="https://xyberclan.dev" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:text-white transition-colors font-bold">XyberClan</a>
                    </p>
                </div>
            </div>

            {/* WhatsApp Float */}
            {settings?.whatsapp && (
                <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.contactWhatsAppMessage || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-8 right-8 bg-green-500 p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
                >
                    <FaWhatsapp className="text-white text-2xl" />
                </a>
            )}
        </footer>
    );
};

export default Footer;
