import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import RichTextEditor from './components/RichTextEditor';
import { stripHtml } from '../utils/textUtils';

const AdminNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Match',
        image: null
    });

    const categories = ['Match', 'Transfert', 'Club', 'Académie', 'Sponsor'];

    const fetchNews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/news');
            setNews(res.data);
            setLoading(false);
        } catch (err) {
            toast.error('Erreur de chargement');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('category', formData.category);
        if (formData.image) data.append('image', formData.image);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            if (editingArticle) {
                await axios.put(`http://localhost:5000/api/news/${editingArticle._id}`, data, config);
                toast.success('Article mis à jour');
            } else {
                await axios.post('http://localhost:5000/api/news', data, config);
                toast.success('Article publié');
            }

            setIsModalOpen(false);
            setEditingArticle(null);
            setFormData({ title: '', content: '', category: 'Match', image: null });
            fetchNews();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet article ?')) {
            try {
                await axios.delete(`http://localhost:5000/api/news/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success('Article supprimé');
                fetchNews();
            } catch (err) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const openEditModal = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            image: null
        });
        setIsModalOpen(true);
    };

    return (
        <div className="flex bg-dark-bg min-h-screen">
            <Sidebar />
            <div className="flex-grow ml-64 p-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black italic text-white uppercase italic">Gestion l'Actualité</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Gérer les articles du club</p>
                    </div>
                    <button
                        onClick={() => { setEditingArticle(null); setIsModalOpen(true); }}
                        className="btn-primary space-x-2"
                    >
                        <FaPlus />
                        <span>Publier un Article</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin h-8 w-8 border-t-2 border-primary-blue rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {news.map(article => (
                            <div key={article._id} className="card-gradient rounded-2xl overflow-hidden border border-white/5 flex flex-col group h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={article.image ? `http://localhost:5000${article.image}` : '/images/hero.png'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={article.title}
                                    />
                                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(article)} className="p-2 bg-black/60 hover:bg-primary-blue text-white rounded-lg transition-colors backdrop-blur-md"><FaEdit /></button>
                                        <button onClick={() => handleDelete(article._id)} className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-lg transition-colors backdrop-blur-md"><FaTrash /></button>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-primary-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">
                                        {article.category}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="text-xl font-black italic text-white uppercase italic mb-3 leading-tight">{article.title}</h4>
                                    <p className="text-gray-500 text-sm line-clamp-2 mt-auto">
                                        {stripHtml(article.content)}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest italic">
                                            {new Date(article.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic">
                                            Par {article.author || 'Admin'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-card-bg border border-white/10 rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>

                            <h2 className="text-2xl font-black italic text-white uppercase italic mb-8">
                                {editingArticle ? 'Modifier l\'Article' : 'Nouveau l\'Article'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Titre de l'Article</label>
                                        <input
                                            type="text" name="title" value={formData.title} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Catégorie</label>
                                        <select
                                            name="category" value={formData.category} onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary-blue outline-none appearance-none"
                                        >
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(val) => setFormData({ ...formData, content: val })}
                                        label="Contenu de l'Article"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">Image de Couverture</label>
                                    <input
                                        type="file" name="image" onChange={handleChange}
                                        className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary-blue/20 file:text-primary-blue hover:file:bg-primary-blue/30 cursor-pointer"
                                    />
                                </div>

                                <button type="submit" className="btn-primary w-full justify-center py-4 text-sm mt-4 uppercase">
                                    {editingArticle ? 'Mettre à jour' : 'Publier l\'article'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNews;
