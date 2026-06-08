import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
});

export const login = async (username, password) => {
    const response = await api.post('/api/v1/auth/login', { username, password });
    return response.data;
};

export const getClients = async (token) => {
    const response = await api.get('/api/v1/clients', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createClient = async (token, clientData) => {
    const response = await api.post('/api/v1/clients', clientData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getClient = async (token, clientId) => {
    const response = await api.get(`/api/v1/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getMatters = async (token) => {
    const response = await api.get('/api/v1/matters', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createMatter = async (token, matterData) => {
    const response = await api.post('/api/v1/matters', matterData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const uploadDocument = async (token, formData) => {
    const response = await api.post('/api/v1/documents/upload', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const downloadDocument = async (token, documentId) => {
    const response = await api.get(`/api/v1/documents/${documentId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
    });
    return response.data;
};

export const createTimeEntry = async (token, timeEntryData) => {
    const response = await api.post('/api/v1/time-entries', timeEntryData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getInvoices = async (token) => {
    const response = await api.get('/api/v1/invoices', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
