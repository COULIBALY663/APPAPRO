import axios from "axios";

// 🌐 URL de base de ton API NestJS (à ajuster si ton port ou domaine change)
const API_URL = "http://localhost:3000/users";

/**
 * 📝 Inscrire un nouvel utilisateur / administrateur en Base de Données
 * @param {Object} userData - Contient { prenom, nom, email, password }
 * @returns {Promise<Object>} - La réponse du serveur NestJS
 */
export const registerUser = async (userData) => {
  try {
    // On effectue une requête POST vers http://localhost:3000/users
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    // On propage l'erreur pour qu'elle soit attrapée par le catch du Dashboard.jsx
    throw error;
  }
};

/**
 * 👥 Récupérer la liste complète des utilisateurs (Optionnel mais utile)
 */
export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ❌ Supprimer un utilisateur par son ID (Optionnel)
 */
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};