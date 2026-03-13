import axios from 'axios';

// In development we point at the local backend.
// In production, we rely on VITE_API_URL set in Vercel.
// As a fallback, use the known backend domain (prevents broken builds when env vars are missing).
const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'https://top-speed-backend.vercel.app/api'
  : 'http://localhost:5000/api';

if (import.meta.env.DEV) {
  console.debug('Using API baseURL:', API_URL);
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const carService = {
  getAllCars: () => apiClient.get('/cars'),
  getAllCarsIncludingHidden: () => apiClient.get('/cars?includeHidden=true'),
  getCarById: (id) => apiClient.get(`/cars/${id}`),
  createCar: (data) => apiClient.post('/cars', data),
  updateCar: (id, data) => apiClient.put(`/cars/${id}`, data),
  deleteCar: (id) => apiClient.delete(`/cars/${id}`),
  importFromAPI: (brand) => apiClient.post('/cars/admin/import', { brand }),
  uploadImage: (dataUrl) => apiClient.post('/upload', { dataUrl }),
};

export const modificationService = {
  getModifications: (carId, type) =>
    apiClient.get('/modifications', { params: { carId, type } }),
  createModification: (data) => apiClient.post('/modifications', data),
  updateModification: (id, data) => apiClient.put(`/modifications/${id}`, data),
  deleteModification: (id) => apiClient.delete(`/modifications/${id}`),
};

export const recommendationService = {
  getRecommendations: (preferences) =>
    apiClient.post('/recommendations', preferences),
};

export const configuratorService = {
  calculateConfiguration: (carId, modifications) =>
    apiClient.post('/configurator/calculate', { carId, modifications }),
};

export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    apiClient.post('/auth/register', { name, email, password }),
  verifyOTP: (email, otp) =>
    apiClient.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) =>
    apiClient.post('/auth/resend-otp', { email }),
  updateEmail: (newEmail, password) =>
    apiClient.post('/auth/update-email', { newEmail, password }),
};

export const serviceService = {
  sendModificationRequest: (data) =>
    apiClient.post('/service/send-modification-request', data),
  sendMaintenanceRequest: (data) =>
    apiClient.post('/service/send-maintenance-request', data),
};

export const visitorService = {
  trackVisitor: (page) => {
    const headers = {
      'x-session-id': localStorage.getItem('sessionId') || undefined,
    };
    return apiClient.post('/visitors/track', { page }, { headers });
  },
  getVisitorStats: (days = 30) =>
    apiClient.get('/visitors/admin/stats', { params: { days } }),
  getAllVisitors: (page = 1, limit = 50) =>
    apiClient.get('/visitors/admin/all', { params: { page, limit } }),
  deleteOldVisitors: (days = 90) =>
    apiClient.delete('/visitors/admin/cleanup', { data: { days } }),
};
