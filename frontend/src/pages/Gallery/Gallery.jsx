import { API_BASE } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageHero from '../../components/Shared/PageHero';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/gallery');
                setPhotos(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPhotos();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-blue"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <PageHero
                title="GALERIE MÉDIA"
                subtitle="Revivez les moments forts, les célébrations et la passion de notre club en images et vidéos."
                bgImage="https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="max-w-7xl mx-auto px-4 mt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group aspect-square rounded-3xl overflow-hidden cursor-pointer border border-white/5"
                        >
                            {photo.isVideo ? (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                    <div className="w-20 h-20 rounded-full bg-primary-blue flex items-center justify-center text-white text-2xl shadow-2xl transform group-hover:scale-110 transition-transform">▶</div>
                                </div>
                            ) : (
                                <img
                                    src={`${API_BASE}${photo.url}`}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <span className="text-primary-blue text-[10px] font-black uppercase tracking-widest mb-1 italic">{photo.category}</span>
                                <h3 className="text-xl font-black italic text-white uppercase italic leading-none">{photo.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {photos.length === 0 && (
                    <div className="text-center py-20 text-gray-500 uppercase font-black italic tracking-widest opacity-20">
                        La galerie est vide actuellement
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
