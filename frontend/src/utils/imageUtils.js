import { API_BASE } from '../services/api';

export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const base = API_BASE.replace(/\/$/, '');
    const relativePath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${relativePath}`;
};
