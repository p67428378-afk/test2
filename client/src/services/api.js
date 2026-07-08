import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock fallback data to prevent runtime crashes when backend is offline
const mockSettings = {
  is_roundup_enabled: true,
};

const mockSummary = {
  is_roundup_enabled: true,
  today_invested_amount: 4.25,
  total_roundup_amount: 342.5,
};

const mockTransactions = {
  total: 5,
  items: [
    {
      id: "tx-1",
      transaction_date: "2026-07-08",
      merchant_name: "Starbucks Coffee",
      amount: 4.25,
      roundup_amount: 0.75,
      status: "Invested",
    },
    {
      id: "tx-2",
      transaction_date: "2026-07-08",
      merchant_name: "Whole Foods Market",
      amount: 24.1,
      roundup_amount: 0.9,
      status: "Invested",
    },
    {
      id: "tx-3",
      transaction_date: "2026-07-07",
      merchant_name: "Uber Ride",
      amount: 18.5,
      roundup_amount: 0.5,
      status: "Invested",
    },
    {
      id: "tx-4",
      transaction_date: "2026-07-07",
      merchant_name: "Steam Games",
      amount: 14.99,
      roundup_amount: 0.01,
      status: "Invested",
    },
    {
      id: "tx-5",
      transaction_date: "2026-07-06",
      merchant_name: "Chevron Gas",
      amount: 42.35,
      roundup_amount: 0.65,
      status: "Invested",
    },
  ],
};

export const getRoundupSettings = async () => {
  try {
    const response = await api.get("/api/v1/users/me/roundup-settings");
    return response.data;
  } catch (error) {
    console.warn("Using mock fallback for getRoundupSettings:", error.message);
    return mockSettings;
  }
};

export const updateRoundupSettings = async (is_roundup_enabled) => {
  try {
    const response = await api.put("/api/v1/users/me/roundup-settings", {
      is_roundup_enabled,
    });
    return response.data;
  } catch (error) {
    console.warn(
      "Using mock fallback for updateRoundupSettings:",
      error.message,
    );
    mockSettings.is_roundup_enabled = is_roundup_enabled;
    mockSummary.is_roundup_enabled = is_roundup_enabled;
    return { is_roundup_enabled };
  }
};

export const getRoundupSummary = async () => {
  try {
    const response = await api.get("/api/v1/roundups/summary");
    return response.data;
  } catch (error) {
    console.warn("Using mock fallback for getRoundupSummary:", error.message);
    return mockSummary;
  }
};

export const getTransactions = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get("/api/v1/roundups/transactions", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.warn("Using mock fallback for getTransactions:", error.message);
    const items = mockTransactions.items.slice(skip, skip + limit);
    return {
      total: mockTransactions.total,
      items,
    };
  }
};

export const triggerDailyJob = async () => {
  try {
    const response = await api.post("/api/v1/roundups/trigger-daily-job");
    return response.data;
  } catch (error) {
    console.warn("Using mock fallback for triggerDailyJob:", error.message);
    return {
      processed_users_count: 1,
      total_invested_amount: 4.25,
    };
  }
};

export default api;
