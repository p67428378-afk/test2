const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const getPolicyDetails = async (policyId) => {
  const response = await fetch(`${API_BASE_URL}/policy/${policyId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch policy details");
  }
  return response.json();
};

export const updateCoverageOptions = async (policyId, coverageUpdate) => {
  const response = await fetch(`${API_BASE_URL}/policy/${policyId}/coverage`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coverageUpdate),
  });
  if (!response.ok) {
    throw new Error("Failed to update coverage options");
  }
  return response.json();
};

export const cancelPolicy = async (policyId) => {
  const response = await fetch(`${API_BASE_URL}/policy/${policyId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to cancel policy");
  }
  return response.json();
};
