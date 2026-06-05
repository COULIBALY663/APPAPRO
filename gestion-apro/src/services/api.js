import axios from "axios";

// Base URL de ton backend NestJS
const API = axios.create({
  baseURL: "http://localhost:3000", // ton backend
});

// Intercepteur pour ajouter token si connecté
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
