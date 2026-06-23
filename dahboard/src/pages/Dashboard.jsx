import React, { useState } from "react";
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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    if (isRegisterMode) {
      // --- LOGIQUE D'INSCRIPTION ---
      if (form.password !== form.confirmPassword) return alert("Les mots de passe ne correspondent pas !");
      try {
        await registerUser({ prenom: form.prenom, nom: form.nom, email: form.email, password: form.password });
        alert("Inscription avec succès ! Veuillez contacter le 0564225178 pour valider votre compte.");
        setIsRegisterMode(false);
      } catch (err) { 
        alert("Erreur lors de l'inscription."); 
      }
    } else {
      // --- LOGIQUE DE CONNEXION (CORRIGÉE) ---
      try {
        const loginRes = await fetch(`${API_URL}/login/connexion`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });

        if (!loginRes.ok) {
          const errorData = await loginRes.json();
          return alert(errorData.message || "E-mail ou mot de passe incorrect.");
        }

        const data = await loginRes.json();
        
        if (data.access_token) {
           sessionStorage.setItem("adminToken", data.access_token);
           setIsAuthenticated(true);
           alert("Connexion réussie !");
           navigate("/"); 
        } else {
           alert("Connexion échouée : aucun jeton reçu.");
        }
      } catch (err) { 
        console.error(err);
        alert("Erreur de connexion au serveur."); 
      }
    }
  };

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
            
            {!isRegisterMode && (
              <p onClick={() => navigate("/forgot-password")} style={styles.forgotPassText}>
                Mot de passe oublié ?
              </p>
            )}

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
    <div style={styles.dashboard}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.mainContent}>
        <header style={styles.header}>
            <h1>TABLEAU DE BORD</h1>
            <button onClick={() => {sessionStorage.clear(); window.location.reload();}} style={styles.logoutBtn}>Déconnexion</button>
        </header>
        {activeTab === "users" && <UsersTab />}
        {activeTab === "certificats" && <CertificatsTab />}
        {activeTab === "paiements" && <PaiementsTab />}
      </main>
    </div>
  );
}

const styles = {
  authContainer: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" },
  authCard: { background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  input: { padding: "12px", border: "1px solid #ddd", borderRadius: "6px" },
  forgotPassText: { textAlign: "right", fontSize: "12px", color: "#007bff", cursor: "pointer", marginTop: "-5px", marginBottom: "5px" },
  button: { padding: "12px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  toggleText: { textAlign: "center", marginTop: "15px", color: "#007bff", cursor: "pointer", fontSize: "14px" },
  dashboard: { display: "flex", minHeight: "100vh" },
  mainContent: { flex: 1, padding: "30px", background: "#f8f9fa" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  logoutBtn: { padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }
};