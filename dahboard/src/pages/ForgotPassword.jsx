import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({ email: "", otp: "", password: "" });
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    // Appel API pour envoyer l'OTP...
    const res = await fetch("https://appapro.onrender.com/login/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email })
    });
    if (res.ok) setStep(2);
    else alert("Email introuvable.");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    // Appel API pour vérifier l'OTP...
    const res = await fetch("https://appapro.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, otp: formData.otp })
    });
    if (res.ok) setStep(3);
    else alert("Code OTP invalide.");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const res = await fetch("https://appapro.onrender.com/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, otp: formData.otp, password: formData.password })
    });
    if (res.ok) {
        alert("Mot de passe mis à jour !");
        navigate("/");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      {step === 1 && (
        <form onSubmit={handleSendEmail}>
          <h2>Récupération</h2>
          <input type="email" placeholder="Votre email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <button type="submit">Envoyer le code</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <h2>Entrez le code OTP</h2>
          <input placeholder="Code à 6 chiffres" onChange={(e) => setFormData({...formData, otp: e.target.value})} required />
          <button type="submit">Vérifier</button>
          <button type="button" onClick={handleSendEmail}>Renvoyer le code</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleUpdatePassword}>
          <h2>Nouveau mot de passe</h2>
          <input type="password" placeholder="Nouveau mot de passe" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          <button type="submit">Enregistrer</button>
        </form>
      )}
    </div>
  );
}