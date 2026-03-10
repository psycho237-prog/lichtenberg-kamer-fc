import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';
import PageHero from '../../components/Shared/PageHero';

const Tickets = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/pages/tickets');
                setPageData(res.data.content);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    if (loading) return null;

    return (
        <div className="bg-dark-bg min-h-screen pb-20">
            <PageHero
                title={`${pageData?.headerTitle || 'BILLETTERIE'} ${pageData?.headerSubtitle ? '' : 'OFFICIELLE'}`}
                subtitle={pageData?.headerSubtitle || 'Réservez vos places pour les prochains matchs de Lichtenberg-Kamer FC.'}
                bgImage="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Ticketing Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="card-gradient rounded-3xl p-10 border border-white/5">
                            <h2 className="text-3xl font-black italic text-white mb-6 uppercase flex items-center">
                                <FaInfoCircle className="mr-4 text-primary-yellow" /> Informations
                            </h2>
                            <div
                                className="prose prose-invert prose-primary-blue max-w-none text-gray-400 font-semibold leading-relaxed ql-editor !p-0"
                                dangerouslySetInnerHTML={{ __html: pageData?.ticketsDescription || 'Les billets sont disponibles en ligne et aux points de vente agréés.' }}
                            />
                        </div>

                        <div className="card-gradient rounded-3xl p-10 border border-white/5">
                            <h2 className="text-3xl font-black italic text-white mb-6 uppercase flex items-center">
                                <FaMapMarkerAlt className="mr-4 text-primary-blue" /> Points de Vente
                            </h2>
                            <p className="text-gray-400 font-black italic uppercase tracking-widest whitespace-pre-line">
                                {pageData?.pointsOfSale || "Stade Omnisports de Yaoundé\nBoutique Officielle du Club"}
                            </p>
                        </div>
                    </motion.div>

                    {/* Pricing Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-primary-yellow transition-colors group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black italic text-white uppercase italic">BILLET STANDARD</h3>
                                    <p className="text-gray-500 font-bold uppercase text-xs mt-1">Accès Tribune Latérale</p>
                                </div>
                                <div className="text-4xl font-black italic text-primary-yellow">
                                    {pageData?.priceStandard || '500 FCFA'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 border-primary-blue/30 hover:border-primary-blue transition-colors group">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black italic text-white uppercase italic">ACCÈS VIP</h3>
                                    <p className="text-gray-500 font-bold uppercase text-xs mt-1">Tribune Présidentielle & Salon</p>
                                </div>
                                <div className="text-4xl font-black italic text-primary-blue">
                                    {pageData?.priceVIP || '2000 FCFA'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 p-8 rounded-3xl bg-primary-blue/10 border border-primary-blue/20">
                            <p className="text-white font-bold italic text-center leading-relaxed">
                                Note: Pour les abonnements de saison, veuillez vous rendre directement au siège du club avec votre pièce d'identité.
                            </p>
                            <button className="btn-primary w-full justify-center py-4 mt-8 uppercase italic font-black">
                                <FaTicketAlt className="mr-3" /> Réserver Maintenant (Bientôt)
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Tickets;
