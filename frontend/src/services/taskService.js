import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/tasks';

const getAll = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const create = async (task) => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

const update = async (id, updatedTask) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedTask);
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const complete = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/complete`);
  return response.data;
};

export default { getAll, create, update, remove, complete };
