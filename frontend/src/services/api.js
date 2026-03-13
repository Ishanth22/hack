import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err?.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const getStartups = () => api.get('/startups');
export const getStartup = (id) => api.get(`/startups/${id}`);
export const createStartup = (data) => api.post('/startups', data);
export const deleteStartup = (id) => api.delete(`/startups/${id}`);

export const submitMetrics = (data) => api.post('/metrics', data);
export const getMetrics = (startupId) => api.get(`/metrics/${startupId}`);

export const getStartupAnalysis = (id) => api.get(`/startup/${id}/analysis`);
export const getLeaderboard = () => api.get('/leaderboard');
export const getOverview = () => api.get('/analytics/overview');
export const getSentiment = (id) => api.get(`/analytics/sentiment/${id}`);

export default api;
