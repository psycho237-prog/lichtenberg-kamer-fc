import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/gallery');
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
        <div className="min-h-screen bg-dark-bg pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black italic text-white uppercase italic">Galerie</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">Moments forts en images et vidéos</p>
                </div>

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
                                    src={`http://localhost:5000${photo.url}`}
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
