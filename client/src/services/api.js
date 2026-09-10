import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/**
 * Classify email text payload
 * @param {{ text: string, subject?: string, sender?: string }} payload
 */
export async function classifyEmailText(payload) {
  const response = await apiClient.post("/api/v1/emails/classify", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * Classify email from file upload (or multipart form data)
 * @param {FormData} formData
 */
export async function classifyEmailFile(formData) {
  const response = await apiClient.post("/api/v1/emails/classify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Fetch classified emails list with filtering & pagination
 * @param {object} params
 */
export async function getEmails(params = {}) {
  const queryParams = {};
  if (params.category && params.category !== "All") {
    queryParams.category = params.category;
  }
  if (typeof params.min_confidence === "number" && params.min_confidence > 0) {
    queryParams.min_confidence = params.min_confidence;
  }
  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params.start_date) {
    queryParams.start_date = params.start_date;
  }
  if (params.end_date) {
    queryParams.end_date = params.end_date;
  }
  queryParams.skip = typeof params.skip === "number" ? params.skip : 0;
  queryParams.limit = typeof params.limit === "number" ? params.limit : 20;

  const response = await apiClient.get("/api/v1/emails", {
    params: queryParams,
  });
  return response.data;
}

/**
 * Fetch a single email's full classification details
 * @param {string} emailId
 */
export async function getEmailDetail(emailId) {
  const response = await apiClient.get(`/api/v1/emails/${emailId}`);
  return response.data;
}

/**
 * Override the classification category of an email
 * @param {string} emailId
 * @param {string} category
 */
export async function overrideCategory(emailId, category) {
  const response = await apiClient.patch(`/api/v1/emails/${emailId}`, {
    category,
  });
  return response.data;
}

/**
 * Delete an email and its classification
 * @param {string} emailId
 */
export async function deleteEmail(emailId) {
  const response = await apiClient.delete(`/api/v1/emails/${emailId}`);
  return response.data;
}

export default apiClient;
