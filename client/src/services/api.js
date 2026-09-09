import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let loginPromise = null;

async function ensureAuthToken() {
  let token = localStorage.getItem("sproutcare_token");
  if (!token) {
    if (!loginPromise) {
      loginPromise = axios
        .post(`${BASE_URL}/api/v1/auth/login`, {
          email: "test@example.com",
          password: "testpassword",
        })
        .then((res) => {
          if (res.data && res.data.access_token) {
            localStorage.setItem("sproutcare_token", res.data.access_token);
            return res.data.access_token;
          }
          return null;
        })
        .catch(() => null)
        .finally(() => {
          loginPromise = null;
        });
    }
    token = await loginPromise;
  }
  return token;
}

api.interceptors.request.use(
  async (config) => {
    if (
      !config.url.includes("/api/v1/auth/login") &&
      !config.url.includes("/api/v1/auth/register")
    ) {
      const token = await ensureAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/v1/auth/login")
    ) {
      originalRequest._retry = true;
      localStorage.removeItem("sproutcare_token");
      const token = await ensureAuthToken();
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const loginUser = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", { email, password });
  if (response.data && response.data.access_token) {
    localStorage.setItem("sproutcare_token", response.data.access_token);
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/api/v1/auth/register", userData);
  if (response.data && response.data.access_token) {
    localStorage.setItem("sproutcare_token", response.data.access_token);
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("sproutcare_token");
};

// Species APIs
export const getSpeciesList = async (query = "", skip = 0, limit = 50) => {
  const params = { skip, limit };
  if (query) params.q = query;
  const response = await api.get("/api/v1/species", { params });
  return response.data;
};

export const getSpeciesById = async (speciesId) => {
  const response = await api.get(`/api/v1/species/${speciesId}`);
  return response.data;
};

export const createSpecies = async (speciesData) => {
  const response = await api.post("/api/v1/species", speciesData);
  return response.data;
};

// Plants APIs
export const getUserPlants = async (location = "", skip = 0, limit = 50) => {
  const params = { skip, limit };
  if (location && location !== "All Rooms") params.location = location;
  const response = await api.get("/api/v1/plants", { params });
  return response.data;
};

export const createUserPlant = async (plantData) => {
  const response = await api.post("/api/v1/plants", plantData);
  return response.data;
};

export const getUserPlantById = async (plantId) => {
  const response = await api.get(`/api/v1/plants/${plantId}`);
  return response.data;
};

export const updateUserPlant = async (plantId, plantData) => {
  const response = await api.put(`/api/v1/plants/${plantId}`, plantData);
  return response.data;
};

export const deleteUserPlant = async (plantId) => {
  const response = await api.delete(`/api/v1/plants/${plantId}`);
  return response.data;
};

export const waterUserPlant = async (plantId, waterData = {}) => {
  const response = await api.post(`/api/v1/plants/${plantId}/water`, waterData);
  return response.data;
};

// Schedules / Dashboard APIs
export const getDashboardSchedules = async () => {
  const response = await api.get("/api/v1/schedules/dashboard");
  return response.data;
};

export const getWateringNotifications = async () => {
  const response = await api.get("/api/v1/schedules/notifications");
  return response.data;
};

export const triggerReminderNotifications = async () => {
  const response = await api.post("/api/v1/schedules/notifications/send");
  return response.data;
};

export default api;
