import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  logout: async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch (e) {
      console.warn("Logout endpoint error:", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

export const coursesAPI = {
  listCourses: async (params = {}) => {
    const response = await api.get("/api/v1/courses", { params });
    return response.data;
  },
  getCourse: async (courseId) => {
    const response = await api.get(`/api/v1/courses/${courseId}`);
    return response.data;
  },
  createCourse: async (courseData) => {
    const response = await api.post("/api/v1/courses", courseData);
    return response.data;
  },
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/api/v1/courses/${courseId}`, courseData);
    return response.data;
  },
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/api/v1/courses/${courseId}/enroll`);
    return response.data;
  },
  getCourseAssignments: async (courseId) => {
    const response = await api.get(`/api/v1/courses/${courseId}/assignments`);
    return response.data;
  },
  getCourseRoster: async (courseId) => {
    const response = await api.get(`/api/v1/courses/${courseId}/roster`);
    return response.data;
  },
};

export const enrollmentsAPI = {
  getMyEnrollments: async () => {
    const response = await api.get("/api/v1/enrollments/my");
    return response.data;
  },
  listEnrollments: async () => {
    const response = await api.get("/api/v1/enrollments");
    return response.data;
  },
  dropCourse: async (courseId) => {
    const response = await api.delete(`/api/v1/enrollments/${courseId}`);
    return response.data;
  },
};

export const assignmentsAPI = {
  listAssignments: async (params = {}) => {
    const response = await api.get("/api/v1/assignments", { params });
    return response.data;
  },
  getAssignment: async (assignmentId) => {
    const response = await api.get(`/api/v1/assignments/${assignmentId}`);
    return response.data;
  },
  createAssignment: async (assignmentData) => {
    const response = await api.post("/api/v1/assignments", assignmentData);
    return response.data;
  },
  submitAssignment: async (assignmentId, submissionData) => {
    const response = await api.post(
      `/api/v1/assignments/${assignmentId}/submit`,
      submissionData,
    );
    return response.data;
  },
  getAssignmentSubmissions: async (assignmentId) => {
    const response = await api.get(
      `/api/v1/assignments/${assignmentId}/submissions`,
    );
    return response.data;
  },
};

export const submissionsAPI = {
  getMySubmissions: async () => {
    const response = await api.get("/api/v1/submissions/my");
    return response.data;
  },
  getSubmission: async (submissionId) => {
    const response = await api.get(`/api/v1/submissions/${submissionId}`);
    return response.data;
  },
  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.post(
      `/api/v1/submissions/${submissionId}/grade`,
      gradeData,
    );
    return response.data;
  },
};

export default api;
