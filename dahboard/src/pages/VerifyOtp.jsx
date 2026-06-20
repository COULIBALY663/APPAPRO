import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    const res = await fetch("https://appapro.onrender.com/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword })
    });

    if (res.ok) {
      alert("Mot de passe mis à jour avec succès !");
      navigate("/"); // Retour à la connexion
    } else {
      alert("OTP invalide ou expiré.");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Vérification OTP</h2>
      <input placeholder="Entrez le code reçu" onChange={(e) => setOtp(e.target.value)} />
      <input type="password" placeholder="Nouveau mot de passe" onChange={(e) => setNewPassword(e.target.value)} />
      <button onClick={handleVerify}>Valider et changer le mot de passe</button>
    </div>
  );
}