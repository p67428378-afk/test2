import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const createUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users/`, userData);
    return response.data;
};

export const getUserAccounts = async (userId) => {
    const response = await axios.get(`${API_URL}/users/${userId}/accounts/`);
    return response.data;
};
