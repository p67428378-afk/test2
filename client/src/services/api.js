import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header if token exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth Service
export const registerUser = async (userData) => {
  const response = await apiClient.post("/api/v1/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/api/v1/auth/login", credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/api/v1/auth/me");
  return response.data;
};

// Projects Service
export const getProjects = async (params = {}) => {
  const response = await apiClient.get("/api/v1/projects", { params });
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await apiClient.post("/api/v1/projects", projectData);
  return response.data;
};

export const getProject = async (projectId) => {
  const response = await apiClient.get(`/api/v1/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await apiClient.patch(
    `/api/v1/projects/${projectId}`,
    projectData,
  );
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await apiClient.delete(`/api/v1/projects/${projectId}`);
  return response.data;
};

// Tasks Service
export const getTasks = async (params = {}) => {
  const response = await apiClient.get("/api/v1/tasks", { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await apiClient.post("/api/v1/tasks", taskData);
  return response.data;
};

export const getTask = async (taskId) => {
  const response = await apiClient.get(`/api/v1/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await apiClient.patch(`/api/v1/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/api/v1/tasks/${taskId}`);
  return response.data;
};

export const bulkUpdateTasks = async (bulkData) => {
  const response = await apiClient.patch("/api/v1/tasks/bulk-update", bulkData);
  return response.data;
};

// Comments Service
export const getTaskComments = async (taskId, params = {}) => {
  const response = await apiClient.get(`/api/v1/tasks/${taskId}/comments`, {
    params,
  });
  return response.data;
};

export const addComment = async (taskId, commentData) => {
  const response = await apiClient.post(
    `/api/v1/tasks/${taskId}/comments`,
    commentData,
  );
  return response.data;
};

export const updateComment = async (commentId, commentData) => {
  const response = await apiClient.patch(
    `/api/v1/comments/${commentId}`,
    commentData,
  );
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/api/v1/comments/${commentId}`);
  return response.data;
};

// Analytics Service
export const getTaskAnalytics = async (projectId = null) => {
  const params = projectId ? { project_id: projectId } : {};
  const response = await apiClient.get("/api/v1/analytics/tasks", { params });
  return response.data;
};

export const getProductivityAnalytics = async (projectId = null) => {
  const params = projectId ? { project_id: projectId } : {};
  const response = await apiClient.get("/api/v1/analytics/productivity", {
    params,
  });
  return response.data;
};

export const getEscalations = async (params = {}) => {
  const response = await apiClient.get("/api/v1/analytics/escalations", {
    params,
  });
  return response.data;
};

// Brownfield fallback export
export const calculatePremium = async (data) => {
  const response = await apiClient.post(
    "/api/v1/insurance/premium/calculate",
    data,
  );
  return response.data;
};

export default apiClient;
