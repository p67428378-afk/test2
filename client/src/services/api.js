import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGroups = async (skip = 0, limit = 50) => {
  const response = await api.get("/api/v1/groups", { params: { skip, limit } });
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await api.post("/api/v1/groups", groupData);
  return response.data;
};

export const getGroup = async (groupId) => {
  const response = await api.get(`/api/v1/groups/${groupId}`);
  return response.data;
};

export const addGroupMember = async (groupId, memberData) => {
  const response = await api.post(
    `/api/v1/groups/${groupId}/members`,
    memberData,
  );
  return response.data;
};

export const getGroupBalances = async (groupId) => {
  const response = await api.get(`/api/v1/groups/${groupId}/balances`);
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await api.post("/api/v1/expenses", expenseData);
  return response.data;
};

export const getExpenses = async (groupId = null, skip = 0, limit = 50) => {
  const params = { skip, limit };
  if (groupId) params.group_id = groupId;
  const response = await api.get("/api/v1/expenses", { params });
  return response.data;
};

export const getExpense = async (expenseId) => {
  const response = await api.get(`/api/v1/expenses/${expenseId}`);
  return response.data;
};

export const createSettlement = async (settlementData) => {
  const response = await api.post("/api/v1/settlements", settlementData);
  return response.data;
};

export const getGroupSettlements = async (groupId, skip = 0, limit = 50) => {
  const response = await api.get(`/api/v1/groups/${groupId}/settlements`, {
    params: { skip, limit },
  });
  return response.data;
};

export default api;
