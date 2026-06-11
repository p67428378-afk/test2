import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8180';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getContacts = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get(`/api/v1/contacts`, {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

export const createContact = async (contactData) => {
  try {
    const response = await api.post(`/api/v1/contacts`, contactData);
    return response.data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export default api;
