import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboardMetrics = async () => {
  const response = await api.get("/api/v1/dashboard/metrics");
  return response.data;
};

// Sites API
export const getSites = async (params = {}) => {
  const response = await api.get("/api/v1/sites", { params });
  return response.data;
};

export const createSite = async (siteData) => {
  const response = await api.post("/api/v1/sites", siteData);
  return response.data;
};

export const getSite = async (siteId) => {
  const response = await api.get(`/api/v1/sites/${siteId}`);
  return response.data;
};

export const updateSite = async (siteId, siteData) => {
  const response = await api.patch(`/api/v1/sites/${siteId}`, siteData);
  return response.data;
};

export const deleteSite = async (siteId) => {
  const response = await api.delete(`/api/v1/sites/${siteId}`);
  return response.data;
};

// Artifacts API
export const getArtifacts = async (params = {}) => {
  const response = await api.get("/api/v1/artifacts", { params });
  return response.data;
};

export const createArtifact = async (artifactData) => {
  const response = await api.post("/api/v1/artifacts", artifactData);
  return response.data;
};

export const getArtifact = async (artifactId) => {
  const response = await api.get(`/api/v1/artifacts/${artifactId}`);
  return response.data;
};

export const updateArtifact = async (artifactId, artifactData) => {
  const response = await api.patch(
    `/api/v1/artifacts/${artifactId}`,
    artifactData,
  );
  return response.data;
};

export const deleteArtifact = async (artifactId) => {
  const response = await api.delete(`/api/v1/artifacts/${artifactId}`);
  return response.data;
};

// Teams API
export const getTeams = async (params = {}) => {
  const response = await api.get("/api/v1/teams", { params });
  return response.data;
};

export const createTeam = async (teamData) => {
  const response = await api.post("/api/v1/teams", teamData);
  return response.data;
};

export const getTeam = async (teamId) => {
  const response = await api.get(`/api/v1/teams/${teamId}`);
  return response.data;
};

export const deleteTeam = async (teamId) => {
  const response = await api.delete(`/api/v1/teams/${teamId}`);
  return response.data;
};

export const assignMemberToTeam = async (teamId, memberData) => {
  const response = await api.post(
    `/api/v1/teams/${teamId}/members`,
    memberData,
  );
  return response.data;
};

export const getTeamMembers = async (teamId) => {
  const response = await api.get(`/api/v1/teams/${teamId}/members`);
  return response.data;
};

export const getAllTeamMembers = async () => {
  const response = await api.get("/api/v1/teams/members/all");
  return response.data;
};

// Media API
export const uploadMediaRecord = async (mediaData) => {
  const response = await api.post("/api/v1/media/upload", mediaData);
  return response.data;
};

export const getMedia = async (params = {}) => {
  const response = await api.get("/api/v1/media", { params });
  return response.data;
};

export const getMediaAsset = async (mediaId) => {
  const response = await api.get(`/api/v1/media/${mediaId}`);
  return response.data;
};

export const deleteMediaAsset = async (mediaId) => {
  const response = await api.delete(`/api/v1/media/${mediaId}`);
  return response.data;
};

// Lab Analyses API
export const getLabAnalyses = async (params = {}) => {
  const response = await api.get("/api/v1/lab-analyses", { params });
  return response.data;
};

export const createLabAnalysis = async (labData) => {
  const response = await api.post("/api/v1/lab-analyses", labData);
  return response.data;
};

export const getLabAnalysis = async (analysisId) => {
  const response = await api.get(`/api/v1/lab-analyses/${analysisId}`);
  return response.data;
};

export const updateLabAnalysis = async (analysisId, labData) => {
  const response = await api.patch(
    `/api/v1/lab-analyses/${analysisId}`,
    labData,
  );
  return response.data;
};

export const deleteLabAnalysis = async (analysisId) => {
  const response = await api.delete(`/api/v1/lab-analyses/${analysisId}`);
  return response.data;
};

// Publications API
export const getPublications = async (params = {}) => {
  const response = await api.get("/api/v1/publications", { params });
  return response.data;
};

export const createPublication = async (pubData) => {
  const response = await api.post("/api/v1/publications", pubData);
  return response.data;
};

export const getPublication = async (pubId) => {
  const response = await api.get(`/api/v1/publications/${pubId}`);
  return response.data;
};

export const deletePublication = async (pubId) => {
  const response = await api.delete(`/api/v1/publications/${pubId}`);
  return response.data;
};

export const linkPublicationToArtifact = async (linkData) => {
  const response = await api.post("/api/v1/publications/link", linkData);
  return response.data;
};

// 3D Stratigraphy API
export const getSiteStratigraphy = async (siteId) => {
  const response = await api.get(`/api/v1/sites/${siteId}/stratigraphy`);
  return response.data;
};

export const addSiteStratigraphicLayer = async (siteId, layerData) => {
  const response = await api.post(
    `/api/v1/sites/${siteId}/stratigraphy`,
    layerData,
  );
  return response.data;
};

// Offline Synchronization API
export const syncBatchOfflineLogs = async (batchData) => {
  const response = await api.post("/api/v1/sync/batch", batchData);
  return response.data;
};

export const getOfflineSyncStatus = async () => {
  const response = await api.get("/api/v1/sync/status");
  return response.data;
};

// Custody & Storage API
export const registerStorageContainer = async (containerData) => {
  const response = await api.post(
    "/api/v1/custody/storage-containers",
    containerData,
  );
  return response.data;
};

export const getStorageContainers = async (params = {}) => {
  const response = await api.get("/api/v1/custody/storage-containers", {
    params,
  });
  return response.data;
};

export const recordCustodyTransfer = async (transferData) => {
  const response = await api.post("/api/v1/custody/transfer", transferData);
  return response.data;
};

export const getArtifactCustodyHistory = async (artifactId) => {
  const response = await api.get(`/api/v1/custody/history/${artifactId}`);
  return response.data;
};

// QR / Barcode API
export const getQRCode = async (entityType, id) => {
  const response = await api.get(`/api/v1/qr/generate/${entityType}/${id}`);
  return response.data;
};

// ML Material Classification API
export const classifyMaterial = async (mlData) => {
  const response = await api.post("/api/v1/ml/classify-material", mlData);
  return response.data;
};

export default api;
