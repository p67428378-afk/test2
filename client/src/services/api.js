import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
});

// Campaign endpoints
export const getCampaigns = () => api.get('/campaigns');
export const createCampaign = (data) => api.post('/campaigns', data);
export const getCampaign = (id) => api.get(`/campaigns/${id}`);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => api.delete(`/campaigns/${id}`);

// Deliverable endpoints
export const getDeliverables = (campaignId) => api.get(`/campaigns/${campaignId}/deliverables`);
export const createDeliverable = (campaignId, data) => api.post(`/campaigns/${campaignId}/deliverables`, data);
export const updateDeliverable = (id, data) => api.put(`/deliverables/${id}`, data);

// Social Media endpoints
export const connectSocialAccount = (data) => api.post('/social-media-accounts', data);
export const disconnectSocialAccount = (id) => api.delete(`/social-media-accounts/${id}`);

// Engagement Metrics endpoints
export const getEngagementMetrics = () => api.get('/engagement-metrics');

export default api;
