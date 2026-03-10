import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaLock, FaUser } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Bienvenue, Admin!');
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error('Identifiants invalides');
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-card-bg border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-10">
                    <img src="/images/logo.png" alt="Logo" className="h-20 mx-auto mb-6" />
                    <h1 className="text-3xl font-black italic text-white uppercase italic">ADMIN PANEL</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-2">Accès Sécurisé</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Email Personnel</label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-blue text-sm" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@lichtenberg-kamer.de"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary-blue transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Mot de Passe</label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-blue text-sm" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary-blue transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center py-4 text-lg mt-4">
                        Se Connecter
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                        ← Retour au site
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
