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
  login: async (username, password) => {
    const response = await api.post("/api/v1/users/login", {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (username, email, password, role) => {
    const response = await api.post("/api/v1/users/register", {
      username,
      email,
      password,
      role,
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const bookService = {
  getBooks: async (search = "") => {
    const params = {};
    if (search) {
      params.search = search;
    }
    const response = await api.get("/api/v1/books", { params });
    return response.data;
  },
  getBookDetails: async (bookId) => {
    const response = await api.get(`/api/v1/books/${bookId}`);
    return response.data;
  },
  addBook: async (bookData) => {
    const response = await api.post("/api/v1/books", bookData);
    return response.data;
  },
};

export const loanService = {
  borrowBook: async (bookCopyId) => {
    const response = await api.post(`/api/v1/loans/borrow/${bookCopyId}`);
    return response.data;
  },
  returnBook: async (bookCopyId) => {
    const response = await api.post(`/api/v1/loans/return/${bookCopyId}`);
    return response.data;
  },
  getMyLoans: async () => {
    const response = await api.get("/api/v1/users/me/loans");
    return response.data;
  },
  getAllLoans: async () => {
    const response = await api.get("/api/v1/loans");
    return response.data;
  },
};

export default api;
