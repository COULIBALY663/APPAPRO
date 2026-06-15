import axios from "axios";

// Utilisez la variable d'environnement définie sur Render
// Remplacez votre ancien POST vers /auth/register par :
const API_BASE_URL = "https://appapro.onrender.com";

export const registerUser = async (userData) => {
  // L'URL correcte est /users, car c'est là que votre contrôleur NestJS attend la requête POST
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
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