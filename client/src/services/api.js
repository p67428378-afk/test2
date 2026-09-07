import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSessions = async (skip = 0, limit = 50) => {
  const response = await apiClient.get("/api/v1/sessions", {
    params: { skip, limit },
  });
  return response.data;
};

export const createSession = async (game_name) => {
  const response = await apiClient.post("/api/v1/sessions", { game_name });
  return response.data;
};

export const getSession = async (session_id) => {
  const response = await apiClient.get(`/api/v1/sessions/${session_id}`);
  return response.data;
};

export const updateSession = async (session_id, data) => {
  const response = await apiClient.patch(
    `/api/v1/sessions/${session_id}`,
    data,
  );
  return response.data;
};

export const deleteSession = async (session_id) => {
  const response = await apiClient.delete(`/api/v1/sessions/${session_id}`);
  return response.data;
};

export const getPlayers = async (session_id) => {
  const response = await apiClient.get(
    `/api/v1/sessions/${session_id}/players`,
  );
  return response.data;
};

export const addPlayer = async (session_id, name) => {
  const response = await apiClient.post(
    `/api/v1/sessions/${session_id}/players`,
    { name },
  );
  return response.data;
};

export const deletePlayer = async (session_id, player_id) => {
  const response = await apiClient.delete(
    `/api/v1/sessions/${session_id}/players/${player_id}`,
  );
  return response.data;
};

export const submitScore = async (
  session_id,
  player_id,
  points,
  round_or_category = "Round 1",
) => {
  const response = await apiClient.post(
    `/api/v1/sessions/${session_id}/scores`,
    {
      player_id,
      points: Number(points),
      round_or_category,
    },
  );
  return response.data;
};

export const getScores = async (session_id) => {
  const response = await apiClient.get(`/api/v1/sessions/${session_id}/scores`);
  return response.data;
};

export const deleteScore = async (score_id) => {
  const response = await apiClient.delete(`/api/v1/scores/${score_id}`);
  return response.data;
};

export const getLeaderboard = async (session_id) => {
  const response = await apiClient.get(
    `/api/v1/sessions/${session_id}/leaderboard`,
  );
  return response.data;
};

export default {
  getSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession,
  getPlayers,
  addPlayer,
  deletePlayer,
  submitScore,
  getScores,
  deleteScore,
  getLeaderboard,
};
