import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const getProducts = async (params = {}) => {
  const response = await api.get("/api/v1/products", { params });
  return response.data;
};

export const getWarrantyStats = async () => {
  const response = await api.get("/api/v1/products/stats");
  return response.data;
};

export const getProductDetails = async (productId) => {
  const response = await api.get(`/api/v1/products/${productId}`);
  return response.data;
};

export const registerProduct = async (productData) => {
  const response = await api.post("/api/v1/products", productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/api/v1/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/v1/products/${productId}`);
  return response.data;
};

// Documents API
export const uploadDocument = async (productId, file) => {
  const formData = new FormData();
  formData.append("product_id", productId);
  formData.append("file", file);

  const response = await api.post("/api/v1/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getDocumentDetails = async (receiptId) => {
  const response = await api.get(`/api/v1/documents/${receiptId}`);
  return response.data;
};

// Claims API
export const submitClaim = async (claimData) => {
  const response = await api.post("/api/v1/claims", claimData);
  return response.data;
};

export const getClaims = async (params = {}) => {
  const response = await api.get("/api/v1/claims", { params });
  return response.data;
};

export const getClaimDetails = async (claimId) => {
  const response = await api.get(`/api/v1/claims/${claimId}`);
  return response.data;
};

export const updateClaimStatus = async (claimId, statusData) => {
  const response = await api.patch(
    `/api/v1/claims/${claimId}/status`,
    statusData,
  );
  return response.data;
};

export const getClaimAuditLogs = async (claimId) => {
  const response = await api.get(`/api/v1/claims/${claimId}/audit_logs`);
  return response.data;
};

// Expiry evaluation
export const triggerExpiryEvaluation = async () => {
  const response = await api.post("/api/v1/expiry/evaluate");
  return response.data;
};

export default api;
