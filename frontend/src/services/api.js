import axios from 'axios';

// In dev, Vite proxies /api to the local Flask server.
// On Netlify (or any static host), set VITE_API_URL to your hosted backend, e.g. https://your-backend.example.com/api
const BASE = import.meta.env.VITE_API_URL || '/api';
const DIRECT_BACKEND = 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(config => config, err => Promise.reject(err));

// Response interceptor – normalize errors & fallback to direct backend if proxy is down
api.interceptors.response.use(
  res => res.data,
  async err => {
    const config = err.config;
    if (!err.response && config && !config._retryDirect) {
      config._retryDirect = true;
      config.baseURL = DIRECT_BACKEND;
      try {
        const directRes = await axios(config);
        return directRes.data;
      } catch (retryErr) {
        return Promise.reject(new Error('Unable to connect to prediction server at ' + DIRECT_BACKEND + '. Please check that python app.py is running.'));
      }
    }
    if (!err.response) {
      return Promise.reject(new Error('Unable to connect to prediction server. Please ensure the backend is running on port 5000.'));
    }
    const msg = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status})`;
    return Promise.reject(new Error(msg));
  }
);

// ── Health ──────────────────────────────────────────
export const checkHealth = () => api.get('/health');

// ── Dataset ─────────────────────────────────────────
export const fetchDataset = (params = {}) => api.get('/dataset', { params });

// ── Statistics ───────────────────────────────────────
export const fetchStatistics = () => api.get('/statistics');

// ── Model Metrics ────────────────────────────────────
export const fetchModelMetrics = () => api.get('/model-metrics');

// ── Correlation ──────────────────────────────────────
export const fetchCorrelation = () => api.get('/correlation');

// ── Prediction ───────────────────────────────────────
export const predict = (payload) => api.post('/predict', payload);

// ── Upload Dataset ───────────────────────────────────
export const uploadDataset = (formData) =>
  api.post('/upload-dataset', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ── History ──────────────────────────────────────────
export const fetchHistory = () => api.get('/history');
export const deleteHistory = (id) => api.delete(`/history/${id}`);
export const clearHistory = () => api.delete('/history');

export default api;
