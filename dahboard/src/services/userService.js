import axios from "axios";

// Utilisez la variable d'environnement définie sur Render
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://appapro.onrender.com";

export const registerUser = async (userData) => {
  // Ajustez ici la route réelle attendue par votre backend (ex: /auth/register ou /users)
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
  return response.data;
};