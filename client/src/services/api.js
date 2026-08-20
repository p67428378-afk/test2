import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically attach JWT token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  register: async (email, password, fullName) => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const response = await api.post("/api/v1/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const productService = {
  list: async (filters = {}) => {
    const response = await api.get("/api/v1/products", { params: filters });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
  },
  create: async (productData) => {
    const response = await api.post("/api/v1/products", productData);
    return response.data;
  },
};

export const claimService = {
  create: async (claimData) => {
    const response = await api.post("/api/v1/claims", claimData);
    return response.data;
  },
  update: async (id, claimUpdateData) => {
    const response = await api.put(`/api/v1/claims/${id}`, claimUpdateData);
    return response.data;
  },
};

export const documentService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/v1/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
