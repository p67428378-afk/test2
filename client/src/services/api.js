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

export default api;

// Auth Services
export const registerUser = async (data) => {
  const response = await api.post("/api/v1/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post("/api/v1/auth/login", data);
  if (response.data && response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Patient Services
export const createPatient = async (data) => {
  const response = await api.post("/api/v1/patients", data);
  return response.data;
};

export const getPatients = async (params = {}) => {
  const response = await api.get("/api/v1/patients", { params });
  return response.data;
};

export const getPatientById = async (patientId) => {
  const response = await api.get(`/api/v1/patients/${patientId}`);
  return response.data;
};

export const updatePatient = async (patientId, data) => {
  const response = await api.patch(`/api/v1/patients/${patientId}`, data);
  return response.data;
};

// Doctor & Slot Services
export const createDoctorSlot = async (data) => {
  const response = await api.post("/api/v1/doctors/slots", data);
  return response.data;
};

export const getDoctorSlots = async (params = {}) => {
  const response = await api.get("/api/v1/doctors/slots", { params });
  return response.data;
};

export const getSlotsByDoctorId = async (doctorId, params = {}) => {
  const response = await api.get(`/api/v1/doctors/${doctorId}/slots`, {
    params,
  });
  return response.data;
};

// Appointment Services
export const bookAppointment = async (data) => {
  const response = await api.post("/api/v1/appointments", data);
  return response.data;
};

export const getAppointments = async (params = {}) => {
  const response = await api.get("/api/v1/appointments", { params });
  return response.data;
};

export const getAppointmentById = async (appointmentId) => {
  const response = await api.get(`/api/v1/appointments/${appointmentId}`);
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await api.patch(
    `/api/v1/appointments/${appointmentId}/status`,
    { status },
  );
  return response.data;
};

// EMR Services
export const createEMRRecord = async (data) => {
  const response = await api.post("/api/v1/emr/records", data);
  return response.data;
};

export const getPatientEMRHistory = async (patientId) => {
  const response = await api.get(`/api/v1/emr/patients/${patientId}`);
  return response.data;
};

export const getEMRRecordById = async (recordId) => {
  const response = await api.get(`/api/v1/emr/records/${recordId}`);
  return response.data;
};

// Billing & Invoice Services
export const createInvoice = async (data) => {
  const response = await api.post("/api/v1/invoices", data);
  return response.data;
};

export const getInvoices = async (params = {}) => {
  const response = await api.get("/api/v1/invoices", { params });
  return response.data;
};

export const getInvoiceById = async (invoiceId) => {
  const response = await api.get(`/api/v1/invoices/${invoiceId}`);
  return response.data;
};

export const updateInvoicePaymentStatus = async (invoiceId, payment_status) => {
  const response = await api.patch(`/api/v1/invoices/${invoiceId}/payment`, {
    payment_status,
  });
  return response.data;
};
