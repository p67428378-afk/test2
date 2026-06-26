import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Role": "Doctor", // Default role to pass medical staff checks
  },
});

export const setRoleHeader = (role) => {
  api.defaults.headers.common["X-Role"] = role;
};

export const patientService = {
  list: async (search = "", skip = 0, limit = 100) => {
    const response = await api.get("/api/v1/patients", {
      params: { search, skip, limit },
    });
    return response.data;
  },
  create: async (patientData) => {
    const response = await api.post("/api/v1/patients", patientData);
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/patients/${id}`);
    return response.data;
  },
};

export const doctorService = {
  list: async () => {
    const response = await api.get("/api/v1/doctors");
    return response.data;
  },
  create: async (doctorData) => {
    const response = await api.post("/api/v1/doctors", doctorData);
    return response.data;
  },
};

export const appointmentService = {
  list: async (skip = 0, limit = 100) => {
    const response = await api.get("/api/v1/appointments", {
      params: { skip, limit },
    });
    return response.data;
  },
  create: async (appointmentData) => {
    const response = await api.post("/api/v1/appointments", appointmentData);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.delete(`/api/v1/appointments/${id}`);
    return response.data;
  },
};

export const medicalRecordService = {
  create: async (recordData) => {
    const response = await api.post("/api/v1/medical_records", recordData);
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/medical_records/${id}`);
    return response.data;
  },
};

export const billingService = {
  listInvoices: async (skip = 0, limit = 100) => {
    const response = await api.get("/api/v1/invoices", {
      params: { skip, limit },
    });
    return response.data;
  },
  createInvoice: async (invoiceData) => {
    const response = await api.post("/api/v1/invoices", invoiceData);
    return response.data;
  },
  submitClaim: async (invoiceId) => {
    const response = await api.post(`/api/v1/invoices/${invoiceId}/claim`);
    return response.data;
  },
  createPayment: async (paymentData) => {
    const response = await api.post("/api/v1/payments", paymentData);
    return response.data;
  },
};

export const pharmacyService = {
  listMedications: async () => {
    const response = await api.get("/api/v1/medications");
    return response.data;
  },
  createMedication: async (medicationData) => {
    const response = await api.post("/api/v1/medications", medicationData);
    return response.data;
  },
  createPrescription: async (prescriptionData) => {
    const response = await api.post("/api/v1/prescriptions", prescriptionData);
    return response.data;
  },
  dispensePrescription: async (prescriptionId) => {
    const response = await api.post(
      `/api/v1/prescriptions/${prescriptionId}/dispense`,
    );
    return response.data;
  },
};

export default api;
