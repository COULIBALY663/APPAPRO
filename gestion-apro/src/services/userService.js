import API from "./api";
// Récupérer le profil de l'utilisateur connecté
export const getProfile = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

// Inscription
export const registerUser = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await API.post("/login", data);
  // Sauvegarder le token si JWT
  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }
  return res.data;
};

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

// Récupérer un utilisateur par email
export const getUserByEmail = async (email) => {
  const res = await API.get(`/users/email/${email}`);
  return res.data;
};

// Modifier utilisateur
export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

// Supprimer utilisateur
export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      console.log("Non autorisé, veuillez vous connecter.");
    }
    return Promise.reject(error);
  }
);

