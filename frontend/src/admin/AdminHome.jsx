import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import RichTextEditor from './components/RichTextEditor';

const AdminHome = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        aboutContent: '',
        visionContent: '',
        philosophyContent: ''
    });

    const fetchContent = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/pages/home');
            if (res.data && res.data.content) {
                setContent(res.data.content);
            }
            setLoading(false);
        } catch (err) {
            // If home page not found, keep default state
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
            await axios.put('http://localhost:5000/api/pages/home', {
                title: 'Home Page',
                content: content
            }, config);
            toast.success('Page d\'accueil mise à jour');
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
                        <h1 className="text-4xl font-black italic text-white uppercase italic">Gestion Accueil</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer le contenu de la page principale</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
                        <div className="card-gradient rounded-3xl p-8 border border-white/5 space-y-6">
                            <h3 className="text-primary-blue font-black italic uppercase text-lg mb-4 italic tracking-widest">Section Hero</h3>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Titre Principal</label>
                                <input
                                    type="text" value={content.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold uppercase"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Sous-titre</label>
                                <textarea
                                    value={content.heroSubtitle} onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none resize-none font-bold italic"
                                />
                            </div>
                        </div>

                        <div className="card-gradient rounded-3xl p-8 border border-white/5">
                            <h3 className="text-primary-blue font-black italic uppercase text-lg mb-6 italic tracking-widest">Section À Propos</h3>
                            <RichTextEditor
                                value={content.aboutContent}
                                onChange={(val) => handleChange('aboutContent', val)}
                                label="Description du Club"
                            />
                        </div>

                        <div className="card-gradient rounded-3xl p-8 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-2">
                                <h3 className="text-primary-blue font-black italic uppercase text-lg mb-6 italic tracking-widest">Vision et Philosophie</h3>
                            </div>
                            <RichTextEditor
                                value={content.visionContent}
                                onChange={(val) => handleChange('visionContent', val)}
                                label="Notre Vision"
                            />
                            <RichTextEditor
                                value={content.philosophyContent}
                                onChange={(val) => handleChange('philosophyContent', val)}
                                label="Notre Philosophie"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase italic"
                        >
                            {saving ? 'Sauvegarde...' : 'Enregistrer toutes les modifications'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminHome;
