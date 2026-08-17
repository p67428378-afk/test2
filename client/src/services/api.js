import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth endpoints
export const registerUser = async (email, password, isAdmin = false) => {
  const response = await api.post("/users/register", {
    email,
    password,
    is_admin: isAdmin,
  });
  return response.data;
};

export const loginUser = async (username, password) => {
  // Note: /api/v1/users/login expects application/x-www-form-urlencoded
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await api.post("/users/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (response.data && response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
    // Decode or fetch user info if needed, or just store email/admin status
    // For simplicity, we can store the email/admin status in localStorage too
    // Let's decode the token or just store the username/email
    localStorage.setItem("user_email", username);
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_email");
  localStorage.removeItem("is_admin");
};

// Items endpoints
export const getItems = async (filters = {}) => {
  const response = await api.get("/items", { params: filters });
  return response.data;
};

export const getItem = async (itemId) => {
  const response = await api.get(`/items/${itemId}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post("/items", itemData);
  return response.data;
};

export const getItemMatches = async (itemId) => {
  const response = await api.get(`/items/${itemId}/matches`);
  return response.data;
};

// Claims endpoints
export const createClaim = async (itemId) => {
  const response = await api.post("/claims", { item_id: itemId });
  return response.data;
};

export const getClaims = async () => {
  const response = await api.get("/claims");
  return response.data;
};

export const getClaim = async (claimId) => {
  const response = await api.get(`/claims/${claimId}`);
  return response.data;
};

export const verifyClaim = async (claimId, status) => {
  const response = await api.put(`/claims/${claimId}/verify`, { status });
  return response.data;
};

// Messages endpoints
export const getClaimMessages = async (claimId) => {
  const response = await api.get(`/claims/${claimId}/messages`);
  return response.data;
};

export const createClaimMessage = async (claimId, text) => {
  const response = await api.post(`/claims/${claimId}/messages`, { text });
  return response.data;
};

export default api;
