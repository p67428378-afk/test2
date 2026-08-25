import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
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
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  async register(email, password) {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
    });
    return response.data;
  },

  async login(email, password) {
    // OAuth2PasswordRequestForm expects form-urlencoded data
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

  async getMe() {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};

export const filmService = {
  async searchFilms(query) {
    if (!query || query.length < 2) {
      return [];
    }
    const response = await api.get(
      `/api/v1/films?search=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
};

export const watchlistService = {
  async getWatchlist() {
    const response = await api.get("/api/v1/watchlist");
    return response.data;
  },

  async addToWatchlist(filmId) {
    const response = await api.post("/api/v1/watchlist", { film_id: filmId });
    return response.data;
  },

  async removeFromWatchlist(filmId) {
    const response = await api.delete(`/api/v1/watchlist/${filmId}`);
    return response.data;
  },
};

export const ratingService = {
  async getRatings() {
    const response = await api.get("/api/v1/ratings");
    return response.data;
  },

  async rateFilm(filmId, rating) {
    const response = await api.post("/api/v1/ratings", {
      film_id: filmId,
      rating,
    });
    return response.data;
  },

  async clearRating(filmId) {
    const response = await api.delete(`/api/v1/ratings/${filmId}`);
    return response.data;
  },
};

export default api;
