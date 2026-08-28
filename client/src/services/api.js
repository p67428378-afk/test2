import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getResumes = async (skip = 0, limit = 50) => {
  const response = await apiClient.get("/api/v1/resumes", {
    params: { skip, limit },
  });
  return response.data;
};

export const getResumeById = async (id) => {
  const response = await apiClient.get(`/api/v1/resumes/${id}`);
  return response.data;
};

export const createResume = async (resumeData) => {
  const response = await apiClient.post("/api/v1/resumes", resumeData);
  return response.data;
};

export const updateResume = async (id, resumeData) => {
  const response = await apiClient.put(`/api/v1/resumes/${id}`, resumeData);
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await apiClient.delete(`/api/v1/resumes/${id}`);
  return response.data;
};

export const exportResumePdf = async (id) => {
  const response = await apiClient.get(`/api/v1/resumes/${id}/export`, {
    responseType: "blob",
  });
  return response.data;
};

export const downloadPdfBlob = (blob, filename = "resume.pdf") => {
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: "application/pdf" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
