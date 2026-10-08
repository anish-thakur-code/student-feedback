import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export async function submitFeedback(feedback) {
  const response = await api.post('/feedback', feedback);
  return response.data;
}

export default api;
