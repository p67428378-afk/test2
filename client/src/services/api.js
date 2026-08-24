import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
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
  async register(email, password, fullName) {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  async login(email, password) {
    // Use the JSON login endpoint for convenience
    const response = await api.post("/api/v1/auth/login/json", {
      email,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  getToken() {
    return localStorage.getItem("token");
  },
};

export const quotesService = {
  async getDailyQuote() {
    const response = await api.get("/api/v1/quotes/daily");
    return response.data;
  },

  async getRandomQuote() {
    const response = await api.get("/api/v1/quotes/random");
    return response.data;
  },
};

export const favoritesService = {
  async getFavorites() {
    const response = await api.get("/api/v1/favorites");
    return response.data;
  },

  async addFavorite(quoteId, text = null, author = null, category = null) {
    const payload = {};
    if (quoteId) {
      payload.quote_id = quoteId;
    } else {
      payload.text = text;
      payload.author = author;
      payload.category = category;
    }
    const response = await api.post("/api/v1/favorites", payload);
    return response.data;
  },

  async removeFavorite(favoriteId) {
    const response = await api.delete(`/api/v1/favorites/${favoriteId}`);
    return response.data;
  },
};

export default api;
