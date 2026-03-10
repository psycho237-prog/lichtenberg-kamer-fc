import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaTwitter, FaInstagram, FaFacebook, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/pages/contact');
                setPageData(res.data.content);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const contactInfo = [
        { icon: <FaMapMarkerAlt />, title: "Siège Social", info: pageData?.address || "Yaoundé, Cameroun" },
        { icon: <FaPhoneAlt />, title: "Téléphone", info: pageData?.phone || "+237 670 000 000", extra: pageData?.workingHours || "Lun - Ven, 8h - 17h" },
        { icon: <FaEnvelope />, title: "Email", info: pageData?.email || "contact@lichtenberg-kamer.de" },
    ];

    if (loading) return null;

    return (
        <div className="bg-dark-bg min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-20 text-center">
                    <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-4 italic">
                        CONTACTEZ-<span className="text-primary-yellow">NOUS</span>
                    </h1>
                    {pageData?.infoContent ? (
                        <div
                            className="text-gray-400 text-lg max-w-2xl mx-auto font-semibold ql-editor !p-0"
                            dangerouslySetInnerHTML={{ __html: pageData.infoContent }}
                        />
                    ) : (
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-semibold uppercase italic tracking-widest">
                            Une question sur la billetterie, l'académie ou le club ? Nos équipes sont à votre entière disposition.
                        </p>
                    )}
                </header>

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
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="bg-white/5 border border-white/1 transition-all hover:bg-white/10 p-6 rounded-xl flex items-start space-x-4">
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

                        {/* Real Google Map */}
                        <div className="relative rounded-xl overflow-hidden h-96 grayscale contrast-125 border border-white/10 group">
                            <iframe
                                title="Lichtenberg Berlin Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1d155355.2223783935!2d13.4357!3d52.516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84ec0c2734103%3A0xe67c944439c0d38c!2sLichtenberg%2C%20Berlin!5e0!3m2!1sen!2sde!4v1709569741000!5m2!1sen!2sde"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                            ></iframe>
                            <div className="absolute bottom-4 left-4 right-4 bg-dark-bg/80 backdrop-blur p-3 rounded-xl border border-white/10 text-[10px] text-center text-white font-black uppercase tracking-widest italic group-hover:translate-y-20 transition-transform duration-500">
                                Lichtenberg, Berlin, Germany
                            </div>
                        </div>

                        {/* Social Follow */}
                        <div className="card-gradient p-6 rounded-xl border border-white/5">
                            <h4 className="text-white font-black italic uppercase text-sm mb-6 text-center">Suivez le club</h4>
                            <div className="flex justify-center space-x-4">
                                {[<FaFacebook />, <FaTwitter />, <FaInstagram />, <FaWhatsapp />].map((icon, i) => (
                                    <button key={i} className="bg-white/5 p-4 rounded-lg text-white hover:bg-primary-blue transition-colors text-xl">
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
