import { API_BASE } from '../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import RichTextEditor from './components/RichTextEditor';

const AdminContact = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        address: '',
        phone: '',
        email: '',
        infoContent: '',
        workingHours: ''
    });

    const fetchContent = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/pages/contact');
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
            await axios.put(API_BASE + '/api/pages/contact', {
                title: 'Contact Page',
                content: content
            }, config);
            toast.success('Page de contact mise à jour');
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
                        <h1 className="text-4xl font-black italic text-white uppercase italic tracking-tighter">Gestion Contact</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les coordonnées et l'information club</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                        <div className="card-gradient rounded-3xl p-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <h3 className="text-primary-blue font-black italic uppercase text-lg mb-4 italic tracking-widest">Coordonnées Directes</h3>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold">Adresse Physique</label>
                                <textarea
                                    value={content.address} onChange={(e) => handleChange('address', e.target.value)}
                                    rows="2"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none resize-none font-bold italic"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold">Téléphone / WhatsApp</label>
                                <input
                                    type="text" value={content.phone} onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic"
                                />
                                <div className="mt-4">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold uppercase">e-mail Officiel</label>
                                    <input
                                        type="email" value={content.email} onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-gradient rounded-3xl p-8 border border-white/5">
                            <h3 className="text-primary-blue font-black italic uppercase text-lg mb-6 italic tracking-widest">Informations Additionnelles</h3>
                            <RichTextEditor
                                value={content.infoContent}
                                onChange={(val) => handleChange('infoContent', val)}
                                label="Description ou Message de Contact"
                            />
                            <div className="mt-6">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block font-bold italic mr-3">Heures de permanence</label>
                                <input
                                    type="text" value={content.workingHours} onChange={(e) => handleChange('workingHours', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-black italic uppercase"
                                    placeholder="Ex: Lun - Ven, 08:30 - 17:00"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase italic"
                        >
                            {saving ? 'Sauvegarde...' : 'Enregistrer la Page de Contact'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminContact;
