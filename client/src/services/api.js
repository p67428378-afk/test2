import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const authApi = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
};

export const petsApi = {
  getPets: async (params = {}) => {
    const response = await api.get("/api/v1/pets", { params });
    return response.data;
  },
  createPet: async (petData) => {
    const response = await api.post("/api/v1/pets", petData);
    return response.data;
  },
  getPet: async (id) => {
    const response = await api.get(`/api/v1/pets/${id}`);
    return response.data;
  },
  updatePet: async (id, petData) => {
    const response = await api.put(`/api/v1/pets/${id}`, petData);
    return response.data;
  },
};

export const appointmentsApi = {
  getAppointments: async (params = {}) => {
    const response = await api.get("/api/v1/appointments", { params });
    return response.data;
  },
  createAppointment: async (appointmentData) => {
    const response = await api.post("/api/v1/appointments", appointmentData);
    return response.data;
  },
  updateAppointmentStatus: async (id, statusData) => {
    const response = await api.put(
      `/api/v1/appointments/${id}/status`,
      statusData,
    );
    return response.data;
  },
};

export const medicalRecordsApi = {
  createMedicalRecord: async (recordData) => {
    const response = await api.post("/api/v1/medical-records", recordData);
    return response.data;
  },
  getPetMedicalRecords: async (petId) => {
    const response = await api.get(`/api/v1/pets/${petId}/medical-records`);
    return response.data;
  },
};

export const vaccinationsApi = {
  createVaccination: async (vaccinationData) => {
    const response = await api.post("/api/v1/vaccinations", vaccinationData);
    return response.data;
  },
  getPetVaccinations: async (petId) => {
    const response = await api.get(`/api/v1/pets/${petId}/vaccinations`);
    return response.data;
  },
};

export const remindersApi = {
  getReminders: async (params = {}) => {
    const response = await api.get("/api/v1/reminders", { params });
    return response.data;
  },
  processReminders: async () => {
    const response = await api.post("/api/v1/reminders/process");
    return response.data;
  },
};

export default api;
