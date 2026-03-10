import { API_BASE } from '../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import RichTextEditor from './components/RichTextEditor';

const AdminTickets = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        headerTitle: '',
        headerSubtitle: '',
        ticketsDescription: '',
        priceStandard: '',
        priceVIP: '',
        pointsOfSale: ''
    });

    const fetchContent = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/pages/tickets');
            if (res.data && res.data.content) {
                setContent(res.data.content);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleChange = (key, value) => {
        setContent({ ...content, [key]: value });
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
            await axios.put(API_BASE + '/api/pages/tickets', {
                title: 'Tickets Page',
                content: content
            }, config);
            toast.success('Page des tickets mise à jour');
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
                        <h1 className="text-4xl font-black italic text-white uppercase italic tracking-tighter">Gestion Tickets</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les tarifs et infos de billetterie</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                        <div className="card-gradient rounded-3xl p-8 border border-white/5 space-y-6">
                            <h3 className="text-primary-blue font-black italic uppercase text-lg mb-6 italic tracking-widest">En-tête Billetterie</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold">Titre En-tête</label>
                                    <input
                                        type="text" value={content.headerTitle} onChange={(e) => handleChange('headerTitle', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold">Sous-titre</label>
                                    <input
                                        type="text" value={content.headerSubtitle} onChange={(e) => handleChange('headerSubtitle', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic uppercase"
                                    />
                                </div>
                            </div>
                            <RichTextEditor
                                value={content.ticketsDescription}
                                onChange={(val) => handleChange('ticketsDescription', val)}
                                label="Informations Générales Billetterie"
                            />
                        </div>

                        <div className="card-gradient rounded-3xl p-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <h3 className="text-primary-blue font-black italic uppercase text-lg mb-4 italic tracking-widest">Tarification & Vente</h3>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold italic mr-3">Prix Standard</label>
                                <input
                                    type="text" value={content.priceStandard} onChange={(e) => handleChange('priceStandard', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic uppercase"
                                    placeholder="Ex: 500 FCFA"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold italic mr-3">Prix VIP</label>
                                <input
                                    type="text" value={content.priceVIP} onChange={(e) => handleChange('priceVIP', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic uppercase"
                                    placeholder="Ex: 2000 FCFA"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold italic mr-3">Points de Vente Officiels</label>
                                <textarea
                                    value={content.pointsOfSale} onChange={(e) => handleChange('pointsOfSale', e.target.value)}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic uppercase italic tracking-widest"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase italic"
                        >
                            {saving ? 'Sauvegarde...' : 'Enregistrer la Billetterie'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminTickets;
