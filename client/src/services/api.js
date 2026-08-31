import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("mbbs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    if (response.data?.access_token) {
      localStorage.setItem("mbbs_token", response.data.access_token);
      localStorage.setItem("mbbs_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post("/api/v1/auth/register", userData);
    if (response.data?.access_token) {
      localStorage.setItem("mbbs_token", response.data.access_token);
      localStorage.setItem("mbbs_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("mbbs_token");
    localStorage.removeItem("mbbs_user");
  },
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("mbbs_user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};

export const modulesApi = {
  listModules: async (subject = null, skip = 0, limit = 50) => {
    const params = { skip, limit };
    if (subject && subject !== "all") {
      params.subject = subject.toLowerCase();
    }
    const response = await apiClient.get("/api/v1/modules", { params });
    return response.data;
  },
  getModule: async (id) => {
    const response = await apiClient.get(`/api/v1/modules/${id}`);
    return response.data;
  },
  createModule: async (moduleData) => {
    const response = await apiClient.post("/api/v1/modules", moduleData);
    return response.data;
  },
};

export const annotationsApi = {
  getAnnotations: async (moduleId) => {
    const response = await apiClient.get(
      `/api/v1/annotations/module/${moduleId}`,
    );
    return response.data;
  },
  createLayer: async (layerData) => {
    const response = await apiClient.post(
      "/api/v1/annotations/layers",
      layerData,
    );
    return response.data;
  },
  createHotspot: async (hotspotData) => {
    const response = await apiClient.post(
      "/api/v1/annotations/hotspots",
      hotspotData,
    );
    return response.data;
  },
};

export const quizzesApi = {
  getQuizzes: async (moduleId) => {
    const response = await apiClient.get(`/api/v1/quizzes/module/${moduleId}`);
    return response.data;
  },
  evaluateAnswer: async (checkpointId, selectedOption) => {
    const response = await apiClient.post("/api/v1/quizzes/evaluate", {
      checkpoint_id: checkpointId,
      selected_option: selectedOption,
    });
    return response.data;
  },
  createCheckpoint: async (checkpointData) => {
    const response = await apiClient.post(
      "/api/v1/quizzes/checkpoints",
      checkpointData,
    );
    return response.data;
  },
};

export const progressApi = {
  recordProgress: async (progressData) => {
    const response = await apiClient.post("/api/v1/progress", progressData);
    return response.data;
  },
  listProgress: async (userId = null, moduleId = null) => {
    const params = {};
    if (userId) params.user_id = userId;
    if (moduleId) params.module_id = moduleId;
    const response = await apiClient.get("/api/v1/progress", { params });
    return response.data;
  },
  getSummary: async (userId = null) => {
    const params = {};
    if (userId) params.user_id = userId;
    const response = await apiClient.get("/api/v1/progress/summary", {
      params,
    });
    return response.data;
  },
  getModuleProgress: async (moduleId, userId = null) => {
    const params = {};
    if (userId) params.user_id = userId;
    const response = await apiClient.get(
      `/api/v1/progress/module/${moduleId}`,
      { params },
    );
    return response.data;
  },
};

export default {
  auth: authApi,
  modules: modulesApi,
  annotations: annotationsApi,
  quizzes: quizzesApi,
  progress: progressApi,
};
