import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Poses API
export const getPoses = async (params = {}) => {
  const response = await apiClient.get("/api/v1/poses", { params });
  return response.data;
};

export const getPoseById = async (poseId) => {
  const response = await apiClient.get(`/api/v1/poses/${poseId}`);
  return response.data;
};

export const createPose = async (poseData) => {
  const response = await apiClient.post("/api/v1/poses", poseData);
  return response.data;
};

export const updatePose = async (poseId, poseData) => {
  const response = await apiClient.put(`/api/v1/poses/${poseId}`, poseData);
  return response.data;
};

// Routines API
export const getRoutines = async (params = {}) => {
  const response = await apiClient.get("/api/v1/routines", { params });
  return response.data;
};

export const getRoutineById = async (routineId) => {
  const response = await apiClient.get(`/api/v1/routines/${routineId}`);
  return response.data;
};

export const createRoutine = async (routineData) => {
  const response = await apiClient.post("/api/v1/routines", routineData);
  return response.data;
};

export const updateRoutine = async (routineId, routineData) => {
  const response = await apiClient.put(
    `/api/v1/routines/${routineId}`,
    routineData,
  );
  return response.data;
};

export const duplicateRoutine = async (routineId) => {
  const response = await apiClient.post(
    `/api/v1/routines/${routineId}/duplicate`,
  );
  return response.data;
};

export const deleteRoutine = async (routineId) => {
  const response = await apiClient.delete(`/api/v1/routines/${routineId}`);
  return response.data;
};
