import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

export const uploadManuscript = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/manuscripts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getManuscripts = async (skip = 0, limit = 20) => {
  const response = await api.get('/manuscripts', {
    params: { skip, limit },
  });
  return response.data;
};

export const getManuscriptDetails = async (id) => {
  const response = await api.get(`/manuscripts/${id}`);
  return response.data;
};

export const updateManuscriptDetails = async (id, updateData) => {
  const response = await api.put(`/manuscripts/${id}`, updateData);
  return response.data;
};

export const inviteCollaborator = async (id, email, role) => {
  const response = await api.post(`/manuscripts/${id}/collaborators`, { email, role });
  return response.data;
};

export const getCollaborators = async (id) => {
  const response = await api.get(`/manuscripts/${id}/collaborators`);
  return response.data;
};

export const runComplianceCheck = async (id, stylesheetId) => {
  const response = await api.post(`/manuscripts/${id}/compliance-check`, {
    stylesheet_id: stylesheetId,
  });
  return response.data;
};

export const getStylesheets = async () => {
  const response = await api.get('/stylesheets');
  return response.data;
};

export const getRevisions = async (id) => {
  const response = await api.get(`/manuscripts/${id}/revisions`);
  return response.data;
};

export const submitRebuttal = async (id, revisionId, authorRebuttal, textLink) => {
  const response = await api.post(`/manuscripts/${id}/revisions/${revisionId}/rebuttal`, {
    author_rebuttal: authorRebuttal,
    text_link: textLink,
  });
  return response.data;
};

export default api;
