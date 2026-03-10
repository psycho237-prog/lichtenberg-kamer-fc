import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const AdminGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'match',
        isVideo: false,
        videoUrl: '',
        photo: null
    });

    const categories = ['match', 'training', 'event', 'highlight'];

    const fetchPhotos = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/gallery');
            setPhotos(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erreur de chargement');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === 'photo') {
            setFormData({ ...formData, photo: files[0] });
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('isVideo', formData.isVideo);
        if (formData.isVideo) {
            data.append('videoUrl', formData.videoUrl);
        }
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            await axios.post('http://localhost:5000/api/gallery', data, config);
            toast.success('Élément ajouté à la galerie');
            setIsModalOpen(false);
            setFormData({ title: '', category: 'match', isVideo: false, videoUrl: '', photo: null });
            fetchPhotos();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet élément ?')) {
            try {
                await axios.delete(`http://localhost:5000/api/gallery/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Supprimé avec succès');
                fetchPhotos();
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic">Gestion Galerie</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les médias du club</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary space-x-2"
                    >
                        <FaPlus />
                        <span>Ajouter un Média</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {photos.map(photo => (
                            <div key={photo._id} className="card-gradient rounded-2xl overflow-hidden border border-white/5 group relative aspect-square">
                                {photo.isVideo ? (
                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full border-2 border-primary-blue flex items-center justify-center mx-auto mb-2 text-primary-blue">▶</div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase uppercase italic">Vidéo</span>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={photo.url ? `http://localhost:5000${photo.url}` : '/images/hero.png'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={photo.title}
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                    <button
                                        onClick={() => handleDelete(photo._id)}
                                        className="p-3 bg-red-500 text-white rounded-xl shadow-lg transform hover:scale-110 transition-all font-black"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 right-2 bg-black/40 backdrop-blur-md rounded-lg p-2">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-primary-blue mb-0.5 italic">{photo.category}</div>
                                    <div className="text-[10px] font-bold text-white truncate italic">{photo.title || 'Sans titre'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h2 className="text-2xl font-black italic text-white uppercase italic mb-8">Nouveau Média</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Titre (Optionnel)</label>
                                    <input
                                        type="text" name="title" value={formData.title} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Catégorie</label>
                                        <select
                                            name="category" value={formData.category} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none appearance-none font-bold"
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center pt-8">
                                        <input
                                            type="checkbox" name="isVideo" id="isVideo"
                                            checked={formData.isVideo} onChange={handleChange}
                                            className="w-5 h-5 bg-white/5 border-white/10 rounded cursor-pointer accent-primary-blue"
                                        />
                                        <label htmlFor="isVideo" className="ml-3 text-[10px] font-black uppercase text-gray-400 tracking-widest cursor-pointer">Est une Vidéo</label>
                                    </div>
                                </div>

                                {formData.isVideo ? (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">URL Vidéo (YouTube/Vimeo)</label>
                                        <input
                                            type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none font-bold"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Image</label>
                                        <input
                                            type="file" name="photo" onChange={handleChange}
                                            className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary-blue/20 file:text-primary-blue hover:file:bg-primary-blue/30 cursor-pointer"
                                            required={!formData.isVideo}
                                        />
                                    </div>
                                )}

                                <button type="submit" className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase">
                                    Ajouter à la Galerie
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGallery;
