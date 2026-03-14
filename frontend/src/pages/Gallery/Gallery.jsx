import { API_BASE } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import PageHero from '../../components/Shared/PageHero';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

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
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedPhoto(photo)}
                            className="relative group aspect-square rounded-xl md:rounded-3xl overflow-hidden cursor-pointer border border-white/5"
                        >
                            {photo.isVideo ? (
                                <div className="w-full h-full bg-black relative flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    {(photo.url || photo.videoUrl)?.includes('youtube.com') || (photo.url || photo.videoUrl)?.includes('youtu.be') ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${(photo.url || photo.videoUrl).split('v=')[1] || (photo.url || photo.videoUrl).split('/').pop()}`}
                                            className="w-full h-full"
                                            title={photo.title}
                                            frameBorder="0"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video
                                            src={getImageUrl(photo.url || photo.videoUrl)}
                                            className="w-full h-full object-cover"
                                            controls={false}
                                            muted
                                            playsInline
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => e.target.pause()}
                                        />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                        <div className="w-16 h-16 rounded-full bg-primary-blue/80 flex items-center justify-center text-white text-xl">▶</div>
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={getImageUrl(photo.url)}
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

            {/* Lightbox / Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white text-4xl hover:text-primary-yellow z-10 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full transition-colors">&times;</button>
                    <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center relative" onClick={e => e.stopPropagation()}>
                        {selectedPhoto.isVideo ? (
                            <div className="w-full aspect-video bg-black flex flex-col items-center justify-center rounded-2xl overflow-hidden">
                                {(selectedPhoto.url || selectedPhoto.videoUrl)?.includes('youtube.com') || (selectedPhoto.url || selectedPhoto.videoUrl)?.includes('youtu.be') ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${(selectedPhoto.url || selectedPhoto.videoUrl).split('v=')[1] || (selectedPhoto.url || selectedPhoto.videoUrl).split('/').pop()}`}
                                        className="w-full h-full"
                                        title={selectedPhoto.title}
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video
                                        src={getImageUrl(selectedPhoto.url || selectedPhoto.videoUrl)}
                                        className="w-full h-full object-contain"
                                        controls
                                        autoPlay
                                    />
                                )}
                            </div>
                        ) : (
                            <img
                                src={getImageUrl(selectedPhoto.url)}
                                alt={selectedPhoto.title}
                                className="max-w-full max-h-[75vh] object-contain rounded-xl md:rounded-2xl"
                            />
                        )}
                        {selectedPhoto.title && (
                            <div className="mt-4 md:mt-6 text-center">
                                <span className="text-primary-blue text-[10px] md:text-sm font-black uppercase tracking-widest mb-1 italic block">{selectedPhoto.category || 'Média'}</span>
                                <h3 className="text-xl md:text-3xl font-black italic text-white uppercase">{selectedPhoto.title}</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
