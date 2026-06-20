import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [formData, setFormData] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  // Étape 1 : Envoi de l'email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    const res = await fetch("https://appapro.onrender.com/login/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email })
    });
    if (res.ok) setStep(2);
    else alert("Email introuvable.");
  };

  // Étape 2 & 3 : Vérification OTP et mise à jour mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Les mots de passe ne correspondent pas !");
    }

    const res = await fetch("https://appapro.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: formData.email, 
        otp: formData.otp, 
        newPassword: formData.password 
      })
    });

    if (res.ok) {
      alert("Mot de passe mis à jour avec succès !");
      navigate("/");
    } else {
      alert("Code OTP invalide ou expiré.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {step === 1 && (
          <form onSubmit={handleSendEmail}>
            <h2>Récupération</h2>
            <p style={{fontSize: "14px", color: "#666"}}>Entrez votre email pour recevoir le code.</p>
            <input style={styles.input} placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <button type="submit" style={styles.button}>Envoyer le code</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <h2>Vérification OTP</h2>
            <p style={{fontSize: "14px", color: "#666"}}>Code envoyé à : <b>{formData.email}</b></p>
            <input style={styles.input} placeholder="Code à 6 chiffres" onChange={(e) => setFormData({...formData, otp: e.target.value})} required />
            <input type="password" style={styles.input} placeholder="Nouveau mot de passe" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <input type="password" style={styles.input} placeholder="Confirmer mot de passe" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
            <button type="submit" style={styles.button}>Vérifier et Valider</button>
            <button type="button" onClick={handleSendEmail} style={styles.resendBtn}>Renvoyer le code</button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f7f6" },
  card: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "400px" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ddd", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" },
  resendBtn: { background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", fontSize: "14px", marginTop: "15px" }
};