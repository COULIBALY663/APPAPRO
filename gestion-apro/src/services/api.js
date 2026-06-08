import axios from "axios";

// Base URL de votre backend NestJS sur Render avec HTTPS
const API = axios.create({
  baseURL: "https://appapro.onrender.com",
});

// Intercepteur pour ajouter le token JWT à chaque requête si l'utilisateur est connecté
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs globalement (optionnel mais conseillé)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Session expirée ou non autorisé.");
      localStorage.removeItem("token");
      // Optionnel : window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;