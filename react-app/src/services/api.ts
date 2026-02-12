import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Posts
export const getPosts = async (category: string = 'all', page: number = 1, limit: number = 10) => {
  const params: { page: number; limit: number; category?: string } = { page, limit };
  if (category !== 'all') params.category = category;
  const response = await api.get('/posts', { params });
  return response.data;
};

export const getPost = async (id: string) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: Record<string, string>) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Admin
export const adminLogin = async (username: string, password: string) => {
  try {
    console.log('Admin login attempt for:', username);
    const response = await api.post('/auth/login', { email: username, password });
    console.log('Admin login response:', response.data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);
      console.log('Admin login successful!');
    }
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error || 'Admin login failed';
    console.error('Admin login error:', errorMsg);
    throw new Error(errorMsg);
  }
};

// User Registration
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const response = await api.post('/auth/register', { email, password, name });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      const role = response.data.user?.role || 'user';
      localStorage.setItem('userRole', role);
      console.log('User registered and logged in:', email);
    }
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error || 'Registration failed';
    console.error(' Registration error:', errorMsg);
    throw new Error(errorMsg);
  }
};

// Unified Login
export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login for:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response received:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      const role = response.data.user?.role || 'user';
      localStorage.setItem('userRole', role);
      console.log('Login successful! Role:', role);
    }
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error || 'Login failed';
    console.error('Login error:', errorMsg, error.response?.status);
    throw new Error(errorMsg);
  }
};

export const adminLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
};

export const getAdminPosts = async (status: string | null = null, page: number = 1, limit: number = 20) => {
  const params: { page: number; limit: number; status?: string } = { page, limit };
  if (status) params.status = status;
  try {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to fetch posts');
  }
};

export const updatePostStatus = async (id: string, status: string) => {
  try {
    const response = await api.patch(`/admin/posts/${id}`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to update post');
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to delete post');
  }
};

export const editPost = async (id: string, postData: Record<string, string>) => {
  try {
    const response = await api.put(`/admin/posts/${id}`, postData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to edit post');
  }
};

export default api;
