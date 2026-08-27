import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Fetch list of podcast shows with optional search, category filter, and pagination
 */
export async function getPodcasts({
  category,
  search,
  page = 1,
  limit = 10,
} = {}) {
  const params = {};
  if (category && category !== "All Categories" && category !== "All") {
    params.category = category;
  }
  if (search && search.trim() !== "") {
    params.search = search.trim();
  }
  params.page = page;
  params.limit = limit;

  const response = await apiClient.get("/api/v1/podcasts", { params });
  return response.data;
}

/**
 * Fetch detailed metadata for a single podcast show by ID
 */
export async function getPodcastById(id) {
  const response = await apiClient.get(`/api/v1/podcasts/${id}`);
  return response.data;
}

/**
 * Fetch paginated episodes for a specific podcast show
 */
export async function getPodcastEpisodes(
  podcastId,
  { page = 1, limit = 10 } = {},
) {
  const params = { page, limit };
  const response = await apiClient.get(
    `/api/v1/podcasts/${podcastId}/episodes`,
    { params },
  );
  return response.data;
}

/**
 * Fetch detailed metadata for a single episode by ID
 */
export async function getEpisodeById(id) {
  const response = await apiClient.get(`/api/v1/episodes/${id}`);
  return response.data;
}

export default {
  getPodcasts,
  getPodcastById,
  getPodcastEpisodes,
  getEpisodeById,
};
