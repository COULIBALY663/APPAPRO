import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return alert("Veuillez remplir tous les champs.");

    setLoading(true);
    try {
      const res = await fetch("https://appapro.onrender.com/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });

      if (res.ok) {
        alert("Mot de passe mis à jour avec succès !");
        navigate("/");
      } else {
        alert("Code invalide ou expiré.");
      }
    } catch (err) {
      alert("Erreur serveur, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Vérification OTP</h2>
        <p>Code envoyé à : <b>{email}</b></p>
        <form onSubmit={handleVerify} style={styles.form}>
          <input 
            style={styles.input} 
            placeholder="Entrez le code à 6 chiffres" 
            onChange={(e) => setOtp(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            style={styles.input} 
            placeholder="Nouveau mot de passe" 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Validation..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  card: { background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "6px" },
  button: { padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }
};