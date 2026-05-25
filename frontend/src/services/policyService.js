const API_URL = 'http://localhost:8000/api/v1';

export const getPolicies = async () => {
  const response = await fetch(`${API_URL}/policies/`);
  if (!response.ok) {
    throw new Error('Failed to fetch policies');
  }
  return await response.json();
};

export const getPolicy = async (id) => {
  const response = await fetch(`${API_URL}/policies/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch policy');
  }
  return await response.json();
};

export const createPolicy = async (policy) => {
  const response = await fetch(`${API_URL}/policies/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(policy),
  });
  if (!response.ok) {
    throw new Error('Failed to create policy');
  }
  return await response.json();
};

export const updatePolicy = async (id, policy) => {
  const response = await fetch(`${API_URL}/policies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(policy),
  });
  if (!response.ok) {
    throw new Error('Failed to update policy');
  }
  return await response.json();
};

export const deletePolicy = async (id) => {
  const response = await fetch(`${API_URL}/policies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete policy');
  }
  return await response.json();
};
