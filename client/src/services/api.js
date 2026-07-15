import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDoctors = async () => {
  const response = await api.get("/api/v1/doctors");
  return response.data;
};

export const getDoctorAvailability = async (doctorId, startDate, endDate) => {
  const response = await api.get(`/api/v1/doctors/${doctorId}/availability`, {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post("/api/v1/appointments", appointmentData);
  return response.data;
};

export const getPatientAppointments = async (patientId) => {
  const response = await api.get(`/api/v1/patients/${patientId}/appointments`);
  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  const response = await api.delete(`/api/v1/appointments/${appointmentId}`);
  return response.data;
};

export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
  const response = await api.patch(
    `/api/v1/appointments/${appointmentId}/reschedule`,
    rescheduleData,
  );
  return response.data;
};

export const verifyInsurance = async (verificationData) => {
  const response = await api.post("/api/v1/insurance/verify", verificationData);
  return response.data;
};

export default api;
