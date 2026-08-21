import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDecks = async () => {
  const response = await api.get("/api/v1/decks");
  return response.data;
};

export const createDeck = async (deckData) => {
  const response = await api.post("/api/v1/decks", deckData);
  return response.data;
};

export const getDeck = async (deckId) => {
  const response = await api.get(`/api/v1/decks/${deckId}`);
  return response.data;
};

export const updateDeck = async (deckId, deckData) => {
  const response = await api.put(`/api/v1/decks/${deckId}`, deckData);
  return response.data;
};

export const deleteDeck = async (deckId) => {
  const response = await api.delete(`/api/v1/decks/${deckId}`);
  return response.data;
};

export const getCards = async (deckId) => {
  const response = await api.get(`/api/v1/decks/${deckId}/cards`);
  return response.data;
};

export const createCard = async (deckId, cardData) => {
  const response = await api.post(`/api/v1/decks/${deckId}/cards`, cardData);
  return response.data;
};

export const updateCard = async (cardId, cardData) => {
  const response = await api.put(`/api/v1/cards/${cardId}`, cardData);
  return response.data;
};

export const deleteCard = async (cardId) => {
  const response = await api.delete(`/api/v1/cards/${cardId}`);
  return response.data;
};

export const startQuiz = async (deckId) => {
  const response = await api.post("/api/v1/quizzes", { deck_id: deckId });
  return response.data;
};

export const submitQuiz = async (quizId, score, totalCards) => {
  const response = await api.post(`/api/v1/quizzes/${quizId}/submit`, {
    score,
    total_cards: totalCards,
  });
  return response.data;
};

export default api;
