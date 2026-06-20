import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch("https://appapro.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword: password })
    });

    if (res.ok) {
      alert("Mot de passe mis à jour avec succès !");
      navigate("/");
    } else {
      alert("Code OTP invalide ou expiré.");
    }
  };

  const handleResend = async () => {
    // On rappelle la même route que ForgotPassword pour relancer l'envoi
    const res = await fetch("https://appapro.onrender.com/login/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (res.ok) alert("Nouveau code envoyé !");
    else alert("Erreur lors du renvoi.");
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Vérification OTP</h2>
      <p>Entrez le code reçu par email pour : <b>{email}</b></p>
      
      <form onSubmit={handleVerify}>
        <input 
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          placeholder="Code OTP" 
          onChange={(e) => setOtp(e.target.value)} 
          required 
        />
        <input 
          type="password"
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
          placeholder="Nouveau mot de passe" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          Valider
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <p>Vous n'avez pas reçu le code ?</p>
        <button onClick={handleResend} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline" }}>
          Renvoyer le code
        </button>
      </div>
    </div>
  );
}