import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loanService = {
  getProducts: async (params = {}) => {
    const response = await api.get("/api/v1/loan-products", { params });
    return response.data;
  },

  calculateEMI: async (payload) => {
    const response = await api.post("/api/v1/loans/calculate-emi", payload);
    return response.data;
  },

  createApplication: async (payload) => {
    const response = await api.post("/api/v1/loans/applications", payload);
    return response.data;
  },

  getCustomerApplications: async (customerId, userEmail) => {
    const headers = {};
    if (userEmail) {
      headers["x-user-email"] = userEmail;
    }
    const response = await api.get(
      `/api/v1/customers/${customerId}/applications`,
      { headers },
    );
    return response.data;
  },

  submitDecision: async (applicationId, officerEmail, payload) => {
    const response = await api.patch(
      `/api/v1/loans/applications/${applicationId}/decision`,
      payload,
      {
        params: { officer_email: officerEmail },
      },
    );
    return response.data;
  },
};

export default api;
