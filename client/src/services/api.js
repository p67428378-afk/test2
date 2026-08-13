import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  logout: () => {
    localStorage.removeItem("token");
  },
};

export const tournamentService = {
  getTournaments: async () => {
    const response = await api.get("/api/v1/tournaments");
    return response.data;
  },
  getTournament: async (id) => {
    const response = await api.get(`/api/v1/tournaments/${id}`);
    return response.data;
  },
  createTournament: async (data) => {
    const response = await api.post("/api/v1/tournaments", data);
    return response.data;
  },
  finishTournament: async (id) => {
    const response = await api.post(`/api/v1/tournaments/${id}/finish`);
    return response.data;
  },
};

export const playerService = {
  registerPlayer: async (playerData, tournamentId = null) => {
    const url = tournamentId
      ? `/api/v1/tournaments/${tournamentId}/players`
      : `/api/v1/players`;
    const response = await api.post(url, playerData);
    return response.data;
  },
  getRoster: async (tournamentId) => {
    const response = await api.get(
      `/api/v1/tournaments/${tournamentId}/players`,
    );
    return response.data;
  },
};

export const pairingService = {
  generatePairings: async (tournamentId) => {
    const response = await api.post(
      `/api/v1/tournaments/${tournamentId}/rounds/pairings`,
    );
    return response.data;
  },
  getRounds: async (tournamentId) => {
    const response = await api.get(
      `/api/v1/tournaments/${tournamentId}/rounds`,
    );
    return response.data;
  },
};

export const scoreService = {
  submitScore: async (matchId, result) => {
    const response = await api.post("/api/v1/scores", {
      match_id: matchId,
      result,
    });
    return response.data;
  },
};

export const standingsService = {
  getStandings: async (tournamentId) => {
    const response = await api.get(
      `/api/v1/tournaments/${tournamentId}/standings`,
    );
    return response.data;
  },
};

export const certificateService = {
  verifyCertificate: async (uuid) => {
    const response = await api.get(`/api/v1/certificates/verify/${uuid}`);
    return response.data;
  },
  getCertificatePdfUrl: (uuid) => {
    return `${BASE_URL}/api/v1/certificates/${uuid}/pdf`;
  },
};

export default api;
