import { API_BASE } from '../../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaTwitter, FaInstagram, FaFacebook, FaPaperPlane } from 'react-icons/fa';
import PageHero from '../../components/Shared/PageHero';

const Contact = () => {
    const [pageData, setPageData] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pageRes, settingsRes] = await Promise.all([
                    axios.get(API_BASE + '/api/pages/contact'),
                    axios.get(API_BASE + '/api/pages/settings')
                ]);
                setPageData(pageRes.data.content);
                if (settingsRes.data && settingsRes.data.content) setSettings(settingsRes.data.content);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const contactInfo = [
        { icon: <FaMapMarkerAlt />, title: "Siège Social", info: pageData?.address || "Yaoundé, Cameroun" },
        { icon: <FaPhoneAlt />, title: "Téléphone", info: pageData?.phone || "+237 670 000 000", extra: pageData?.workingHours || "Lun - Ven, 8h - 17h" },
        { icon: <FaEnvelope />, title: "Email", info: pageData?.email || "contact@lichtenberg-kamer.de" },
    ];

    if (loading) return null;

    return (
        <div className="bg-dark-bg min-h-screen pb-20">
            <PageHero
                title="CONTACTEZ-NOUS"
                subtitle={pageData?.infoContent ? pageData.infoContent.replace(/<[^>]+>/g, '') : "Une question sur la billetterie, l'académie ou le club ? Nos équipes sont à votre entière disposition."}
                bgImage="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card-gradient rounded-2xl p-8 md:p-12 border border-white/5"
                        >
                            <h2 className="text-3xl font-black italic text-white mb-8 border-b border-primary-blue inline-block pb-2">Envoyez-nous un message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Nom Complet</label>
                                        <input type="text" placeholder="Jean Dupont" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary-blue" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Email</label>
                                        <input type="email" placeholder="jean.dupont@exemple.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary-blue" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Sujet</label>
                                    <input type="text" placeholder="Demande d'information" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary-blue" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Message</label>
                                    <textarea rows="6" placeholder="Comment pouvons-nous vous aider ?" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white focus:outline-none focus:border-primary-blue resize-none"></textarea>
                                </div>
                                <button className="btn-primary w-full justify-center py-4 text-lg group">
                                    Envoyer le message <FaPaperPlane className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Contact Details Cards */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="bg-white/5 border border-white/1 transition-all hover:bg-white/10 p-4 md:p-6 rounded-xl flex items-start space-x-4">
                                    <div className="p-3 bg-primary-blue/20 text-primary-blue rounded-lg text-xl">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black italic uppercase text-sm mb-1">{item.title}</h4>
                                        <p className="text-gray-400 text-sm leading-snug">{item.info}</p>
                                        {item.extra && <p className="text-gray-500 text-[10px] mt-1 italic font-bold uppercase">{item.extra}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map from CMS */}
                        {pageData?.mapIframe && (
                            <div className="relative rounded-xl overflow-hidden h-48 md:h-96 grayscale contrast-125 border border-white/10 group">
                                <div
                                    className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                                    dangerouslySetInnerHTML={{ __html: pageData.mapIframe }}
                                />
                                <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 bg-dark-bg/80 backdrop-blur p-2 md:p-3 rounded-xl border border-white/10 text-[8px] md:text-[10px] text-center text-white font-black uppercase tracking-widest italic group-hover:translate-y-20 transition-transform duration-500 pointer-events-none">
                                    {pageData?.address || "Lichtenberg, Berlin, Germany"}
                                </div>
                            </div>
                        )}

                        {/* Social Follow from Settings */}
                        <div className="card-gradient p-6 rounded-xl border border-white/5">
                            <h4 className="text-white font-black italic uppercase text-sm mb-6 text-center">Suivez le club</h4>
                            <div className="flex justify-center space-x-4">
                                {settings?.facebook && (
                                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-4 rounded-lg text-white hover:bg-primary-blue transition-colors text-xl">
                                        <FaFacebook />
                                    </a>
                                )}
                                {settings?.twitter && (
                                    <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-4 rounded-lg text-white hover:bg-blue-400 transition-colors text-xl">
                                        <FaTwitter />
                                    </a>
                                )}
                                {settings?.instagram && (
                                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-4 rounded-lg text-white hover:bg-pink-500 transition-colors text-xl">
                                        <FaInstagram />
                                    </a>
                                )}
                                {settings?.whatsapp && (
                                    <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.contactWhatsAppMessage || '')}`} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-4 rounded-lg text-white hover:bg-green-500 transition-colors text-xl">
                                        <FaWhatsapp />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
