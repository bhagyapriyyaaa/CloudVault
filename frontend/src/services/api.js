// src/services/api.js

import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE,
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// File endpoints
export const uploadFile = (formData) =>
  api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getMyFiles = () => api.get("/files/my-files");
export const deleteFile = (fileId) => api.delete(`/files/${fileId}`);

export default api;