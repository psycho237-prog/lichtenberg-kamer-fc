import { API_BASE } from '../services/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import RichTextEditor from './components/RichTextEditor';

const AdminHome = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [content, setContent] = useState({
        heroTitle: '',
        heroSubtitle: '',
        seasonPeriod: '',
        aboutContent: '',
        visionContent: '',
        philosophyContent: '',
        aboutImage: ''
    });

    const fetchContent = async () => {
        try {
            const res = await axios.get(API_BASE + '/api/pages/home');
            if (res.data && res.data.content) {
                setContent(res.data.content);
                if (res.data.content.aboutImage) {
                    setPreview(API_BASE + res.data.content.aboutImage);
                }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const formData = new FormData();
            formData.append('title', 'Home Page');
            formData.append('content', JSON.stringify(content));
            if (image) {
                formData.append('image', image);
            }

            await axios.put(API_BASE + '/api/pages/home', formData, config);
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
                        <h1 className="text-4xl font-black italic text-white uppercase italic tracking-tighter">Gestion Accueil</h1>
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
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Saison / Période</label>
                                <input
                                    type="text" value={content.seasonPeriod || ''} onChange={(e) => handleChange('seasonPeriod', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold uppercase mb-4"
                                    placeholder="Ex: 2024/2025"
                                />
                            </div>
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

                        <div className="card-gradient rounded-3xl p-8 border border-white/5 space-y-6">
                            <h3 className="text-primary-blue font-black italic uppercase text-lg mb-6 italic tracking-widest">Section À Propos</h3>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-full md:w-1/3">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Image de présentation</label>
                                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group mb-4 bg-white/5">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-600 text-xs font-bold uppercase tracking-widest">Aucune image</div>
                                        )}
                                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-black uppercase tracking-widest">
                                            Changer
                                            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                        </label>
                                    </div>
                                </div>

                                <div className="w-full md:w-2/3">
                                    <RichTextEditor
                                        value={content.aboutContent}
                                        onChange={(val) => handleChange('aboutContent', val)}
                                        label="Description du Club"
                                    />
                                </div>
                            </div>
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
