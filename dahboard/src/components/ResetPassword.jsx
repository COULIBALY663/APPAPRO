import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token"); // Récupère le token du lien email
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://appapro.onrender.com/login/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });
      if (res.ok) {
        alert("Mot de passe mis à jour !");
        navigate("/");
      } else {
        alert("Lien expiré ou invalide.");
      }
    } catch (err) { alert("Erreur serveur."); }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Définir un nouveau mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="Nouveau mot de passe" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Confirmer</button>
      </form>
    </div>
  );
}