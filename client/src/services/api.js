import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  register: async (storeName, email, phoneNumber, password) => {
    const response = await api.post("/api/v1/sellers/register", {
      store_name: storeName,
      email,
      phone_number: phoneNumber || null,
      password,
    });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post("/api/v1/sellers/login", {
      email,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("seller", JSON.stringify(response.data.seller));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("seller");
  },
  getCurrentSeller: () => {
    const sellerStr = localStorage.getItem("seller");
    if (sellerStr) {
      try {
        return JSON.parse(sellerStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const productService = {
  getProducts: async (filters = {}) => {
    const params = {};
    if (filters.brand) params.brand = filters.brand;
    if (filters.condition) params.condition = filters.condition;
    if (filters.min_price !== undefined && filters.min_price !== "")
      params.min_price = Number(filters.min_price);
    if (filters.max_price !== undefined && filters.max_price !== "")
      params.max_price = Number(filters.max_price);
    if (filters.ram) params.ram = filters.ram;
    if (filters.storage) params.storage = filters.storage;
    if (filters.search) params.search = filters.search;
    if (filters.skip !== undefined) params.skip = filters.skip;
    if (filters.limit !== undefined) params.limit = filters.limit;

    const response = await api.get("/api/v1/products", { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post("/api/v1/products", {
      brand: productData.brand,
      model: productData.model,
      processor: productData.processor,
      ram: productData.ram,
      storage: productData.storage,
      gpu: productData.gpu,
      screen_size: productData.screen_size,
      condition: productData.condition,
      price: Number(productData.price),
      stock_quantity: Number(productData.stock_quantity),
    });
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/v1/products/${id}`, {
      brand: productData.brand,
      model: productData.model,
      processor: productData.processor,
      ram: productData.ram,
      storage: productData.storage,
      gpu: productData.gpu,
      screen_size: productData.screen_size,
      condition: productData.condition,
      price: Number(productData.price),
      stock_quantity: Number(productData.stock_quantity),
    });
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/api/v1/products/${id}`);
    return response.data;
  },
};

export default api;
