import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

export const api = {
    // ===== Agencies =====
    getAgencies: (params = {}) => {
        return axiosInstance.get('/api/agencies', { params });
    },
    getAgency: (slug) => {
        return axiosInstance.get(`/api/agencies/${slug}`);
    },
    getAgencyBySlug: (slug) => {
        return axiosInstance.get(`/api/agencies/${slug}`);
    },
    createAgency: (data) => {
        return axiosInstance.post('/api/agencies', data);
    },

    // ===== Categories =====
    getCategories: () => {
        return axiosInstance.get('/api/categories');
    },
    getCategory: (slug) => {
        return axiosInstance.get(`/api/categories/${slug}`);
    },
    getCategoryBySlug: (slug) => {
        return axiosInstance.get(`/api/categories/${slug}`);
    },

    // ===== Locations (Updated for Countries) =====
    
    // Continents
    getContinents: () => {
        return axiosInstance.get('/api/locations/continents');
    },
    
    // Countries (replaces States)
    getCountries: (params = {}) => {
        return axiosInstance.get('/api/locations/countries', { params });
    },
    getCountryBySlug: (slug) => {
        return axiosInstance.get(`/api/locations/countries/${slug}`);
    },
    
    // Cities
    getCities: (params = {}) => {
        return axiosInstance.get('/api/locations/cities', { params });
    },
    getCityBySlug: (slug, countrySlug = null) => {
        const params = countrySlug ? { country: countrySlug } : {};
        return axiosInstance.get(`/api/locations/cities/${slug}`, { params });
    },

    // ===== Legacy (for backward compatibility) =====
    getStates: () => {
        // Redirect to countries
        return axiosInstance.get('/api/locations/countries');
    },
    getStateBySlug: (slug) => {
        // Redirect to countries
        return axiosInstance.get(`/api/locations/countries/${slug}`);
    },

    // ===== Generic =====
   get: (path) => {
    return axiosInstance.get(path);
},
post: (path, data) => {
    return axiosInstance.post(path, data);
},
};

export default api;