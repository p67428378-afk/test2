import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tours
export const getTours = (params = {}) =>
  apiClient.get("/api/v1/tours", { params });
export const getTour = (id) => apiClient.get(`/api/v1/tours/${id}`);
export const createTour = (data) => apiClient.post("/api/v1/tours", data);
export const updateTour = (id, data) =>
  apiClient.put(`/api/v1/tours/${id}`, data);
export const deleteTour = (id) => apiClient.delete(`/api/v1/tours/${id}`);

// Guides
export const getGuides = (params = {}) =>
  apiClient.get("/api/v1/guides", { params });
export const getGuide = (id) => apiClient.get(`/api/v1/guides/${id}`);
export const createGuide = (data) => apiClient.post("/api/v1/guides", data);
export const updateGuide = (id, data) =>
  apiClient.put(`/api/v1/guides/${id}`, data);
export const deleteGuide = (id) => apiClient.delete(`/api/v1/guides/${id}`);

// Schedules
export const getSchedules = (params = {}) =>
  apiClient.get("/api/v1/schedules", { params });
export const getSchedule = (id) => apiClient.get(`/api/v1/schedules/${id}`);
export const createSchedule = (data) =>
  apiClient.post("/api/v1/schedules", data);
export const updateSchedule = (id, data) =>
  apiClient.put(`/api/v1/schedules/${id}`, data);
export const assignGuide = (scheduleId, guideId) =>
  apiClient.post(`/api/v1/schedules/${scheduleId}/assign-guide`, {
    guide_id: guideId,
  });
export const getScheduleAttendanceReport = (scheduleId) =>
  apiClient.get(`/api/v1/schedules/${scheduleId}/attendance-report`);

// Bookings
export const getBookings = (params = {}) =>
  apiClient.get("/api/v1/bookings", { params });
export const getBooking = (id) => apiClient.get(`/api/v1/bookings/${id}`);
export const createBooking = (data) => apiClient.post("/api/v1/bookings", data);
export const updateBooking = (id, data) =>
  apiClient.put(`/api/v1/bookings/${id}`, data);
export const cancelBooking = (id) =>
  apiClient.post(`/api/v1/bookings/${id}/cancel`);

// Attendance
export const recordCheckIn = (data) =>
  apiClient.post("/api/v1/attendance/check-in", data);
export const getAttendanceRecords = (params = {}) =>
  apiClient.get("/api/v1/attendance", { params });
export const getAttendance = (id) => apiClient.get(`/api/v1/attendance/${id}`);

// Reviews & Feedback
export const submitReview = (data) => apiClient.post("/api/v1/reviews", data);
export const createReview = submitReview;
export const getReviews = (params = {}) =>
  apiClient.get("/api/v1/reviews", { params });
export const getReview = (id) => apiClient.get(`/api/v1/reviews/${id}`);

// Admin Metrics & Summaries
export const getGuideMetrics = (guideId) =>
  apiClient.get(`/api/v1/admin/guides/${guideId}/metrics`);
export const getAdminGuideMetrics = getGuideMetrics;
export const getAdminFeedbackSummary = () =>
  apiClient.get("/api/v1/admin/feedback/summary");
export const getFeedbackSummary = getAdminFeedbackSummary;

// Health
export const getHealth = () => apiClient.get("/health");

export default apiClient;
