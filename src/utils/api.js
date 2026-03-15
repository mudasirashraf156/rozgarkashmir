import axios from 'axios';

const API = axios.create({ baseURL: 'https://rozgarkashmirbackend.onrender.com/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('rk_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rk_token');
      localStorage.removeItem('rk_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Workers
export const getWorkers = (params) => API.get('/workers', { params });
export const getWorker = (id) => API.get(`/workers/${id}`);
export const updateWorkerProfile = (data) => API.put('/workers/profile', data);
export const toggleAvailability = () => API.patch('/workers/availability');
export const getWorkerStats = () => API.get('/workers/stats/me');

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getBookings = (params) => API.get('/bookings', { params });
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });
export const addReview = (id, data) => API.post(`/bookings/${id}/review`, data);

// Jobs
export const getJobs = (params) => API.get('/jobs', { params });
export const createJob = (data) => API.post('/jobs', data);
export const applyToJob = (id) => API.post(`/jobs/${id}/apply`);
export const getMyJobs = () => API.get('/jobs/my-jobs');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminWorkers = (params) => API.get('/admin/workers', { params });
export const verifyWorker = (id, data) => API.patch(`/admin/workers/${id}/verify`, data);
export const getAdminUsers = (params) => API.get('/admin/users', { params });
export const toggleUserStatus = (id) => API.patch(`/admin/users/${id}/toggle`);
export const getAdminBookings = (params) => API.get('/admin/bookings', { params });

export default API;
