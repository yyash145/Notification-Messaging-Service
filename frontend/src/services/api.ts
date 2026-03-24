import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);

export const signup = (data: {
  name: string;
  email: string;
  password: string;
}) => API.post('/auth/signup', data);