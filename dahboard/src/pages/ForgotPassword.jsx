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
    try {
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
    } catch (err) {
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("https://appapro.onrender.com/login/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) alert("Nouveau code envoyé !");
      else alert("Erreur lors du renvoi.");
    } catch (err) {
      alert("Erreur réseau.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Vérification OTP</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>Code envoyé à : <b>{email}</b></p>
        
        <form onSubmit={handleVerify}>
          <input 
            style={styles.input}
            placeholder="Code à 6 chiffres" 
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
          <input 
            type="password"
            style={styles.input}
            placeholder="Nouveau mot de passe" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={styles.button}>Vérifier et Valider</button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "14px" }}>Vous n'avez pas reçu le code ?</p>
          <button onClick={handleResend} style={styles.resendBtn}>Renvoyer le code</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f7f6" },
  card: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "400px" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  resendBtn: { background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }
};