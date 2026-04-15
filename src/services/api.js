import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

// ── Students ──────────────────────────────────────────────────────────────────
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

// ── Attendance ────────────────────────────────────────────────────────────────
export const attendanceAPI = {
  getByDate: (date) => api.get('/attendance', { params: { date } }),
  submit: (data) => api.post('/attendance', data),
  getReport: (params) => api.get('/attendance/report', { params }),
};

// ── Leaves ────────────────────────────────────────────────────────────────────
export const leavesAPI = {
  getAll: () => api.get('/leaves'),
  apply: (data) => api.post('/leaves', data),
  updateStatus: (id, status) => api.put(`/leaves/${id}`, { status }),
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

export default api;
