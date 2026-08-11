import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  initiatePasswordReset: async (login_id, mobile_number) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      login_id,
      mobile_number,
    });
    return response.data;
  },
  verifyOtp: async (otp_code, otp_session_id) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", {
      otp_code,
      otp_session_id,
    });
    return response.data;
  },
  verifySecurityQuestion: async (answer, security_question_session_id) => {
    const response = await api.post(
      "/api/v1/password-reset/verify-security-question",
      { answer, security_question_session_id },
    );
    return response.data;
  },
  setNewPassword: async (new_password, password_reset_session_id) => {
    const response = await api.post("/api/v1/password-reset/set-new-password", {
      new_password,
      password_reset_session_id,
    });
    return response.data;
  },
};

export const productService = {
  searchProducts: async ({
    q = "",
    limit = 10,
    page = 1,
    category_id = "",
  } = {}) => {
    const params = { q, limit, page };
    if (category_id) {
      params.category_id = category_id;
    }
    const response = await api.get("/api/v1/products/search", { params });
    return response.data;
  },
};

export const bookService = {
  getBooks: async (search = "", genre = "") => {
    const params = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    const response = await api.get("/api/v1/books", { params });
    return response.data;
  },
  getBook: async (bookId) => {
    const response = await api.get(`/api/v1/books/${bookId}`);
    return response.data;
  },
  createBook: async (bookData) => {
    const response = await api.post("/api/v1/books", bookData);
    return response.data;
  },
  updateBook: async (bookId, bookData) => {
    const response = await api.put(`/api/v1/books/${bookId}`, bookData);
    return response.data;
  },
  deleteBook: async (bookId) => {
    await api.delete(`/api/v1/books/${bookId}`);
  },
};

export const memberService = {
  getMembers: async () => {
    const response = await api.get("/api/v1/members");
    return response.data;
  },
  getMember: async (memberId) => {
    const response = await api.get(`/api/v1/members/${memberId}`);
    return response.data;
  },
  createMember: async (memberData) => {
    const response = await api.post("/api/v1/members", memberData);
    return response.data;
  },
  updateMember: async (memberId, memberData) => {
    const response = await api.put(`/api/v1/members/${memberId}`, memberData);
    return response.data;
  },
};

export const loanService = {
  getMemberLoans: async (memberId) => {
    const response = await api.get(`/api/v1/members/${memberId}/loans`);
    return response.data;
  },
  checkoutBook: async (bookId, memberId) => {
    const response = await api.post("/api/v1/loans", {
      book_id: bookId,
      member_id: memberId,
    });
    return response.data;
  },
  returnBook: async (loanId) => {
    const response = await api.put(`/api/v1/loans/${loanId}/return`);
    return response.data;
  },
  sendDueReminders: async () => {
    const response = await api.post("/api/v1/loans/reminders");
    return response.data;
  },
};

export const fineService = {
  getFines: async () => {
    const response = await api.get("/api/v1/fines");
    return response.data;
  },
  payFine: async (fineId) => {
    const response = await api.post(`/api/v1/fines/${fineId}/pay`);
    return response.data;
  },
};

export const inventoryService = {
  getInventoryItems: async (search = "", category = "") => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const response = await api.get("/api/v1/inventory", { params });
    return response.data;
  },
  getInventoryItem: async (itemId) => {
    const response = await api.get(`/api/v1/inventory/${itemId}`);
    return response.data;
  },
  createInventoryItem: async (itemData) => {
    const response = await api.post("/api/v1/inventory", itemData);
    return response.data;
  },
  updateInventoryItem: async (itemId, itemData) => {
    const response = await api.put(`/api/v1/inventory/${itemId}`, itemData);
    return response.data;
  },
  deleteInventoryItem: async (itemId) => {
    const response = await api.delete(`/api/v1/inventory/${itemId}`);
    return response.data;
  },
};

export default api;
