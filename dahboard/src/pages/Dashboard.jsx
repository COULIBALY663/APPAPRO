import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { registerUser } from "../services/userService.js";
import UsersTab from "../components/UsersTab";
import CertificatsTab from "../components/CertificatsTab";
import PaiementsTab from "../components/PaiementsTab";

const API_URL = import.meta.env.VITE_API_URL || "https://appapro.onrender.com";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("adminToken"));
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "", confirmPassword: "" });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "users");

  // États pour les données
  const [users, setUsers] = useState([]);
  const [certificats, setCertificats] = useState([]);
  const [paiements, setPaiements] = useState([]);

  // Chargement des données au montage
  useEffect(() => {
    if (isAuthenticated) {
      // Remplacez par vos appels API réels ici
      console.log("Données chargées pour l'admin");
    }
  }, [isAuthenticated]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      if (form.password !== form.confirmPassword) return alert("Les mots de passe ne correspondent pas !");
      try {
        await registerUser({ prenom: form.prenom, nom: form.nom, email: form.email, password: form.password });
        alert("Inscription réussie ! Contactez le 0564225178 pour validation.");
        setIsRegisterMode(false);
      } catch (err) { alert("Erreur inscription."); }
    } else {
      try {
        const loginRes = await fetch(`${API_URL}/login/connexion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        if (!loginRes.ok) return alert("Connexion échouée.");
        const data = await loginRes.json();
        if (data.access_token) {
          sessionStorage.setItem("adminToken", data.access_token);
          setIsAuthenticated(true);
        }
      } catch (err) { alert("Erreur serveur."); }
    }
  };

  const handleLogout = () => { sessionStorage.clear(); window.location.reload(); };
  const handleDeleteUser = (id) => { console.log("Suppression utilisateur", id); };
  const handleValiderDossier = (id) => { console.log("Validation dossier", id); };
  const handleDeleteCertificat = (id) => { console.log("Suppression certificat", id); };
  
  const getPaymentBadgeStyle = (statut) => ({
    padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold",
    backgroundColor: statut === 'completed' ? "#d4edda" : "#fff3cd",
    color: statut === 'completed' ? "#155724" : "#856404"
  });

  const translatePaymentStatus = (statut) => (statut === 'completed' ? "Payé" : "En attente");

  if (!isAuthenticated) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <h2 style={styles.title}>{isRegisterMode ? "Créer un compte" : "Connexion Admin"}</h2>
          <form onSubmit={handleAuthSubmit} style={styles.form}>
            {isRegisterMode && (
              <>
                <input style={styles.input} placeholder="Nom" onChange={(e) => setForm({...form, nom: e.target.value})} required />
                <input style={styles.input} placeholder="Prénom" onChange={(e) => setForm({...form, prenom: e.target.value})} required />
              </>
            )}
            <input type="email" style={styles.input} placeholder="E-mail" onChange={(e) => setForm({...form, email: e.target.value})} required />
            <input type="password" style={styles.input} placeholder="Mot de passe" onChange={(e) => setForm({...form, password: e.target.value})} required />
            {isRegisterMode && <input type="password" style={styles.input} placeholder="Confirmer mot de passe" onChange={(e) => setForm({...form, confirmPassword: e.target.value})} required />}
            <button type="submit" style={styles.button}>{isRegisterMode ? "S'inscrire" : "Se connecter"}</button>
          </form>
          <p onClick={() => setIsRegisterMode(!isRegisterMode)} style={styles.toggleText}>
            {isRegisterMode ? "Déjà un compte ? Connexion" : "Pas de compte ? S'inscrire"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, padding: "20px", overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ color: "#0d47a1", fontStyle: "italic", fontSize: "40px" }}>TABLEAU DE BORD</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Déconnexion</button>
        </div>

        {activeTab === "users" && <UsersTab users={users} onDeleteUser={handleDeleteUser} />}
        {activeTab === "certificats" && (
          <CertificatsTab 
            certificats={certificats} paiements={paiements} onValiderDossier={handleValiderDossier} 
            onDeleteCertificat={handleDeleteCertificat} getPaymentBadgeStyle={getPaymentBadgeStyle}
            translatePaymentStatus={translatePaymentStatus}
          />
        )}
        {activeTab === "paiements" && (
          <PaiementsTab paiements={paiements} getPaymentBadgeStyle={getPaymentBadgeStyle} translatePaymentStatus={translatePaymentStatus} />
        )}
      </div>
    </div>
  );
}

const styles = {
  authContainer: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  authCard: { background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "6px" },
  button: { padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  toggleText: { textAlign: "center", marginTop: "15px", color: "#007bff", cursor: "pointer" },
  logoutBtn: { background: "#6c757d", color: "white", border: "none", padding: "8px 16px", cursor: "pointer", borderRadius: "4px" }
};