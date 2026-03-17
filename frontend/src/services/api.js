import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
};

export const userService = {
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getProfile: (id) => api.get(`/profile/${id}`),
  updateProfile: (id, data) => api.put(`/profile/${id}`, data),
};

export const analyticsService = {
  getStats: () => api.get('/analytics/stats'),
  getUserGrowth: () => api.get('/analytics/user-growth'),
  getRoleDistribution: () => api.get('/analytics/role-distribution'),
  getWeeklyActivity: () => api.get('/analytics/weekly-activity'),
};

export default api;
