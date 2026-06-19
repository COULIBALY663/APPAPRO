import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Appel vers votre API NestJS configurée
      const res = await fetch("https://appapro.onrender.com/login/forgot-password", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        alert("Les instructions de réinitialisation ont été envoyées à votre email.");
      } else {
        alert("Erreur : Impossible d'envoyer les instructions. Vérifiez l'adresse email.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Une erreur est survenue lors de la connexion au serveur.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Récupération de mot de passe</h2>
      <p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Entrez votre email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />
        <button 
          type="submit" 
          style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
        >
          Envoyer le lien
        </button>
      </form>
    </div>
  );
}