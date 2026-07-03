import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to add X-User-Email header
api.interceptors.request.use((config) => {
  const email = localStorage.getItem("user_email") || "teacher@school.com";
  if (email) {
    config.headers["X-User-Email"] = email;
  }
  return config;
});

export const attendanceApi = {
  // Get classes assigned to the teacher
  getTeacherClasses: async () => {
    const response = await api.get("/api/v1/teacher/classes");
    return response.data;
  },

  // Get attendance records
  getAttendance: async (classId, date) => {
    const params = {};
    if (classId) params.class_id = classId;
    if (date) params.date = date;
    const response = await api.get("/api/v1/attendance", { params });
    return response.data;
  },

  // Mark attendance
  markAttendance: async (classId, date, records) => {
    const response = await api.post("/api/v1/attendance", {
      class_id: classId,
      date,
      records,
    });
    return response.data;
  },

  // Get student attendance detail
  getStudentAttendance: async (studentId) => {
    const response = await api.get(`/api/v1/attendance/student/${studentId}`);
    return response.data;
  },

  // Get school report (Principal)
  getSchoolReport: async (params = {}) => {
    const response = await api.get("/api/v1/reports/school", { params });
    return response.data;
  },
};

export default api;
