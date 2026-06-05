import React, { useEffect, useState } from "react";
import { getProfile } from "../services/userService";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
        alert("Impossible de récupérer le profil");
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <div>Chargement...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mon Profil</h2>
      <p><strong>Nom :</strong> {user.nom}</p>
      <p><strong>Prénom :</strong> {user.prenom}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Inscrit le :</strong> {new Date(user.created_at).toLocaleDateString()}</p>
    </div>
  );
}
