
import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getPolicyHolder = (id) => {
    return apiClient.get(`/policyholders/${id}`);
};

export const getPolicy = (id) => {
    return apiClient.get(`/policies/${id}`);
};

export const updatePolicy = (id, data) => {
    return apiClient.put(`/policies/${id}`, data);
};

export const cancelPolicy = (id) => {
    return apiClient.post(`/policies/${id}/cancel`);
};
