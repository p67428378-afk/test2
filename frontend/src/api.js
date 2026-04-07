const API_BASE_URL = 'http://localhost:8000/api/v1'; // Assuming backend runs on port 8000

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products/`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createApplicant = async (applicantData) => {
  const response = await fetch(`${API_BASE_URL}/applicants/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicantData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createApplication = async (applicationData) => {
  const response = await fetch(`${API_BASE_URL}/applications/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getApplicationStatus = async (applicationId) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
