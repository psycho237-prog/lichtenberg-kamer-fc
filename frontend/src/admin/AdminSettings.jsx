import { API_BASE } from '../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaSave } from 'react-icons/fa';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        whatsapp: '',
        contactWhatsAppMessage: '',
        foundationYear: '',
        trophiesCount: '',
        baseMatchesPlayed: ''
    });

    const fetchSettings = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/pages/settings');
            if (res.data && res.data.content) {
                setSettings(res.data.content);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key, value) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            await axios.put(API_BASE + '/api/pages/settings', {
                title: 'Global Settings',
                content: settings
            }, config);
            toast.success('Paramètres mis à jour avec succès');
            setSaving(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
            setSaving(false);
        }
    };

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic tracking-tighter">Paramètres Globaux</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les réseaux sociaux et configurations site</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                        <div className="card-gradient rounded-3xl p-8 border border-white/5 space-y-6">
                            <h3 className="text-primary-blue font-black italic uppercase text-lg mb-4 italic tracking-widest">Réseaux Sociaux</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center">
                                        <FaFacebook className="mr-2 text-primary-blue text-sm" /> Facebook URL
                                    </label>
                                    <input
                                        type="url" value={settings.facebook} onChange={(e) => handleChange('facebook', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center">
                                        <FaInstagram className="mr-2 text-pink-500 text-sm" /> Instagram URL
                                    </label>
                                    <input
                                        type="url" value={settings.instagram} onChange={(e) => handleChange('instagram', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center">
                                        <FaTwitter className="mr-2 text-blue-400 text-sm" /> Twitter (X) URL
                                    </label>
                                    <input
                                        type="url" value={settings.twitter} onChange={(e) => handleChange('twitter', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-gradient rounded-3xl p-8 border border-white/5 space-y-6">
                            <h3 className="text-primary-yellow font-black italic uppercase text-lg mb-4 italic tracking-widest">WhatsApp & Contact Direct</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center">
                                        <FaWhatsapp className="mr-2 text-green-500 text-sm" /> Numéro WhatsApp
                                    </label>
                                    <input
                                        type="text" value={settings.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                        placeholder="Ex: +49123456789"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block font-bold">Message WhatsApp par défaut (CTA)</label>
                                    <textarea
                                        value={settings.contactWhatsAppMessage} onChange={(e) => handleChange('contactWhatsAppMessage', e.target.value)}
                                        rows="3"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none resize-none font-bold italic"
                                        placeholder="Entrez le message qui sera pré-rempli lors d'un clic sur le bouton WhatsApp"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-gradient rounded-3xl p-8 border border-white/5 space-y-6">
                            <h3 className="text-white font-black italic uppercase text-lg mb-4 italic tracking-widest">Statistiques Publiques</h3>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Modifiez les valeurs manuelles affichées sur la page d'accueil. Les matchs, articles et abonnés sont comptés automatiquement.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Année de création (Fondation)</label>
                                    <input
                                        type="number" value={settings.foundationYear || ''} onChange={(e) => handleChange('foundationYear', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                        placeholder="Ex: 2024"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Nombre de Trophées</label>
                                    <input
                                        type="number" value={settings.trophiesCount || ''} onChange={(e) => handleChange('trophiesCount', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                        placeholder="Ex: 5"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Matchs Joués (Historique hors base de données)</label>
                                <input
                                    type="number" value={settings.baseMatchesPlayed || ''} onChange={(e) => handleChange('baseMatchesPlayed', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                    placeholder="Ex: 50 (S'ajoutera automatiquement aux matchs terminés du site)"
                                />
                                <p className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-widest italic">Ce nombre s'additionnera automatiquement aux matchs dont la date est passée.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase italic tracking-widest"
                        >
                            <FaSave className="mr-2" />
                            {saving ? 'Sauvegarde...' : 'Enregistrer tous les paramètres'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
