import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401
      localStorage.removeItem("hms_token");
      localStorage.removeItem("hms_user");
    }
    return Promise.reject(error);
  },
);

// Auth Service
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("hms_token", response.data.access_token);
      localStorage.setItem("hms_user", JSON.stringify(response.data.user));
    }
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

  logout: () => {
    localStorage.removeItem("hms_token");
    localStorage.removeItem("hms_user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("hms_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
};

// Patient Service
export const patientService = {
  getPatients: async (skip = 0, limit = 20, search = "") => {
    const response = await api.get("/api/v1/patients", {
      params: { skip, limit, search },
    });
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await api.post("/api/v1/patients", patientData);
    return response.data;
  },

  getPatient: async (id) => {
    const response = await api.get(`/api/v1/patients/${id}`);
    return response.data;
  },

  updatePatient: async (id, updateData) => {
    const response = await api.put(`/api/v1/patients/${id}`, updateData);
    return response.data;
  },
};

// Doctor Schedule Service
export const scheduleService = {
  getDoctorSchedule: async (doctorId) => {
    const response = await api.get(`/api/v1/schedules/doctors/${doctorId}`);
    return response.data;
  },

  listSchedules: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/schedules", {
      params: { skip, limit },
    });
    return response.data;
  },

  createSchedule: async (scheduleData) => {
    const response = await api.post("/api/v1/schedules", scheduleData);
    return response.data;
  },
};

// Appointment Service
export const appointmentService = {
  getAppointments: async (
    skip = 0,
    limit = 20,
    status = "",
    doctorId = "",
    patientId = "",
  ) => {
    const response = await api.get("/api/v1/appointments", {
      params: {
        skip,
        limit,
        status,
        doctor_id: doctorId,
        patient_id: patientId,
      },
    });
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post("/api/v1/appointments", appointmentData);
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/api/v1/appointments/${id}/status`, {
      status,
    });
    return response.data;
  },
};

// Medical Records & Prescription Service
export const medicalService = {
  getMedicalRecords: async (
    patientId = "",
    doctorId = "",
    skip = 0,
    limit = 20,
  ) => {
    const response = await api.get("/api/v1/medical-records", {
      params: { patient_id: patientId, doctor_id: doctorId, skip, limit },
    });
    return response.data;
  },

  createMedicalRecord: async (recordData) => {
    const response = await api.post("/api/v1/medical-records", recordData);
    return response.data;
  },

  createPrescription: async (prescriptionData) => {
    const response = await api.post("/api/v1/prescriptions", prescriptionData);
    return response.data;
  },
};

// Billing Service
export const billingService = {
  getInvoices: async (patientId = "", status = "", skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/invoices", {
      params: { patient_id: patientId, status, skip, limit },
    });
    return response.data;
  },

  getInvoice: async (id) => {
    const response = await api.get(`/api/v1/invoices/${id}`);
    return response.data;
  },

  payInvoice: async (id, amount, paymentMethod = "Cash") => {
    const response = await api.post(`/api/v1/invoices/${id}/pay`, {
      amount,
      payment_method: paymentMethod,
    });
    return response.data;
  },
};

export default api;
