import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to inject JWT token
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
  login: async (username, password, isLibrarian = true) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
      is_librarian: isLibrarian,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
};

export const bookService = {
  getBooks: async (search = "", skip = 0, limit = 100) => {
    const response = await api.get("/api/v1/books", {
      params: { search, skip, limit },
    });
    return response.data;
  },
  getBookById: async (id) => {
    const response = await api.get(`/api/v1/books/${id}`);
    return response.data;
  },
  createBook: async (bookData) => {
    const response = await api.post("/api/v1/books", bookData);
    return response.data;
  },
  updateBook: async (id, bookData) => {
    const response = await api.put(`/api/v1/books/${id}`, bookData);
    return response.data;
  },
  deleteBook: async (id) => {
    const response = await api.delete(`/api/v1/books/${id}`);
    return response.data;
  },
};

export const patronService = {
  getPatrons: async (skip = 0, limit = 100) => {
    const response = await api.get("/api/v1/patrons", {
      params: { skip, limit },
    });
    return response.data;
  },
  createPatron: async (patronData) => {
    const response = await api.post("/api/v1/patrons", patronData);
    return response.data;
  },
};

export const circulationService = {
  checkout: async (bookId, patronId, dueDate) => {
    const response = await api.post("/api/v1/circulation/checkout", {
      book_id: bookId,
      patron_id: patronId,
      due_date: dueDate,
    });
    return response.data;
  },
  checkin: async (bookId) => {
    const response = await api.post("/api/v1/circulation/checkin", {
      book_id: bookId,
    });
    return response.data;
  },
};

export const reportService = {
  getCirculationReport: async () => {
    const response = await api.get("/api/v1/reports/circulation");
    return response.data;
  },
};

export default api;
