import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Fetch a paginated list of Markdown documents.
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<{total: number, skip: number, limit: number, items: Array}>}
 */
export async function fetchDocuments(skip = 0, limit = 20) {
  const response = await apiClient.get("/api/v1/documents", {
    params: { skip, limit },
  });
  return response.data;
}

/**
 * Fetch a single document by UUID.
 * @param {string} id
 * @returns {Promise<{id: string, title: string, content: string, created_at: string, updated_at: string}>}
 */
export async function getDocument(id) {
  const response = await apiClient.get(`/api/v1/documents/${id}`);
  return response.data;
}

/**
 * Create a new Markdown document.
 * @param {{title?: string, content: string}} payload
 * @returns {Promise<{id: string, title: string, content: string, created_at: string, updated_at: string}>}
 */
export async function createDocument(payload) {
  const response = await apiClient.post("/api/v1/documents", payload);
  return response.data;
}

/**
 * Update an existing Markdown document.
 * @param {string} id
 * @param {{title?: string, content?: string}} payload
 * @returns {Promise<{id: string, title: string, content: string, created_at: string, updated_at: string}>}
 */
export async function updateDocument(id, payload) {
  const response = await apiClient.put(`/api/v1/documents/${id}`, payload);
  return response.data;
}

/**
 * Delete a document by UUID.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteDocument(id) {
  const response = await apiClient.delete(`/api/v1/documents/${id}`);
  return response.data;
}

export default {
  fetchDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  apiClient,
};
