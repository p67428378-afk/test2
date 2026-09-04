import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Subjects API
export const getSubjects = async (params = {}) => {
  const response = await api.get("/api/v1/subjects", { params });
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await api.post("/api/v1/subjects", subjectData);
  return response.data;
};

export const getSubject = async (subjectId) => {
  const response = await api.get(`/api/v1/subjects/${subjectId}`);
  return response.data;
};

export const updateSubject = async (subjectId, subjectData) => {
  const response = await api.put(`/api/v1/subjects/${subjectId}`, subjectData);
  return response.data;
};

export const deleteSubject = async (subjectId) => {
  const response = await api.delete(`/api/v1/subjects/${subjectId}`);
  return response.data;
};

export const getSubjectProgress = async (subjectId) => {
  const response = await api.get(`/api/v1/subjects/${subjectId}/progress`);
  return response.data;
};

// Topics API
export const getTopics = async (params = {}) => {
  const response = await api.get("/api/v1/topics", { params });
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await api.post("/api/v1/topics", topicData);
  return response.data;
};

export const getTopic = async (topicId) => {
  const response = await api.get(`/api/v1/topics/${topicId}`);
  return response.data;
};

export const updateTopic = async (topicId, topicData) => {
  const response = await api.put(`/api/v1/topics/${topicId}`, topicData);
  return response.data;
};

export const deleteTopic = async (topicId) => {
  const response = await api.delete(`/api/v1/topics/${topicId}`);
  return response.data;
};

export const updateTopicStatus = async (topicId, status) => {
  const response = await api.patch(`/api/v1/topics/${topicId}/status`, {
    status,
  });
  return response.data;
};

// Schedules API
export const getSchedules = async (params = {}) => {
  const response = await api.get("/api/v1/schedules", { params });
  return response.data;
};

export const createSchedule = async (scheduleData) => {
  const response = await api.post("/api/v1/schedules", scheduleData);
  return response.data;
};

export const getSchedule = async (scheduleId) => {
  const response = await api.get(`/api/v1/schedules/${scheduleId}`);
  return response.data;
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  const response = await api.put(
    `/api/v1/schedules/${scheduleId}`,
    scheduleData,
  );
  return response.data;
};

export const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`/api/v1/schedules/${scheduleId}`);
  return response.data;
};

export const setDailyGoal = async (goalData) => {
  const response = await api.post("/api/v1/schedules/daily-goal", goalData);
  return response.data;
};

export const getDailyGoal = async (targetDate) => {
  const response = await api.get(`/api/v1/schedules/daily-goal/${targetDate}`);
  return response.data;
};

// Study Logs API
export const getStudyLogs = async (params = {}) => {
  const response = await api.get("/api/v1/study-logs", { params });
  return response.data;
};

export const createStudyLog = async (logData) => {
  const response = await api.post("/api/v1/study-logs", logData);
  return response.data;
};

export const getStudyLog = async (logId) => {
  const response = await api.get(`/api/v1/study-logs/${logId}`);
  return response.data;
};

export const deleteStudyLog = async (logId) => {
  const response = await api.delete(`/api/v1/study-logs/${logId}`);
  return response.data;
};

// Recommendations API
export const getAIRecommendations = async (limit = 5) => {
  const response = await api.get("/api/v1/recommendations/next-topics", {
    params: { limit },
  });
  return response.data;
};

export default api;
