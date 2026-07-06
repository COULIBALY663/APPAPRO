import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { registerUser } from "../services/userService.js"; 
import UsersTab from "../components/UsersTab";
import CertificatsTab from "../components/CertificatsTab";
import PaiementsTab from "../components/PaiementsTab";
import { io } from "socket.io-client";
import { activerNotifications } from "../services/notificationService.js";

const API_URL = import.meta.env.VITE_API_URL || "https://pageadminapro.onrender.com";
const socket = io(API_URL);

export default function Dashboard() {
 const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("adminToken"));
   const [isRegisterMode, setIsRegisterMode] = useState(false);
   const [authNom, setAuthNom] = useState("");
   const [authPrenom, setAuthPrenom] = useState("");
   const [authEmail, setAuthEmail] = useState("");
   const [authPassword, setAuthPassword] = useState("");
   const [authConfirmPassword, setAuthConfirmPassword] = useState("");
   const [activationMessage, setActivationMessage] = useState("");
   
   const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "users");
   const [users, setUsers] = useState([]);
   const [certificats, setCertificats] = useState([]);
   const [paiements, setPaiements] = useState([]);
  // 1. Initialisation unique des notifications et du socket
  useEffect(() => {
    if (!isAuthenticated) return;

    // Activation des notifications
    if (Notification.permission === "granted") {
      activerNotifications();
    }

    // Gestion Socket
    socket.on("nouvelle-demande", () => {
      fetchUsers(); fetchCertificats(); fetchPaiements();
      new Audio("/notification.mp3").play();
    });

    return () => socket.off("nouvelle-demande");
  }, [isAuthenticated]);

  // 2. Chargement des données
  const fetchUsers = async () => { try { const res = await fetch(`${API_URL}/users`); setUsers(await res.json() || []); } catch (err) { console.error(err); } };
  const fetchCertificats = async () => { try { const res = await fetch(`${API_URL}/certificat`); setCertificats(await res.json() || []); } catch (err) { console.error(err); } };
  const fetchPaiements = async () => { try { const res = await fetch(`${API_URL}/paiement`); setPaiements(await res.json() || []); } catch (err) { console.error(err); } };

  useEffect(() => {
    if (isAuthenticated) { fetchUsers(); fetchCertificats(); fetchPaiements(); }
  }, [isAuthenticated]);

  // ... (gardez vos fonctions handleValiderDossier, handleDeleteUser, handleDeleteCertificat)
  const handleValiderDossier = async (id, statutActuel) => {
    const nouveauStatut = statutActuel === "Traité" ? "En attente" : "Traité";
    if (!window.confirm(`Passer le dossier #${id} à : ${nouveauStatut} ?`)) return;
    try {
      const res = await fetch(`${API_URL}/certificat/${id}/statut`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      if (res.ok) fetchCertificats();
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try { if ((await fetch(`${API_URL}/users/${id}`, { method: "DELETE" })).ok) fetchUsers(); } catch (err) { console.error(err); }
  };

  const handleDeleteCertificat = async (id) => {
    if (!window.confirm("Supprimer ce certificat ?")) return;
    try { if ((await fetch(`${API_URL}/certificat/${id}`, { method: "DELETE" })).ok) fetchCertificats(); } catch (err) { console.error(err); }
  };


  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await fetch(`${API_URL}/login/connexion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });

      if (!loginRes.ok) return alert("Email ou mot de passe incorrect");
      
      const loginData = await loginRes.json();
      sessionStorage.setItem("adminToken", loginData.access_token);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion");
    }
  };

  const handleLogout = () => { sessionStorage.removeItem("adminToken"); window.location.reload(); };

  // ... (votre RENDER reste identique à votre version)
   // ================= RENDER =================
    if (!isAuthenticated) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "Arial", padding: "20px" }}>
          <form onSubmit={handleAuthSubmit} style={{ background: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", width: "100%", maxWidth: "420px" }}>
            
            <h2 style={{ textAlign: "center", color: "#0d47a1" }}>{isRegisterMode ? "Inscription" : "Connexion Admin"}</h2>
            {activationMessage && <div style={{ color: "#856404", background: "#fff3cd", padding: "10px", marginBottom: "15px", textAlign: "center" }}>{activationMessage}</div>}
            
            {isRegisterMode && (
              <>
                <input type="text" placeholder="Nom" value={authNom} onChange={(e) => setAuthNom(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />
                <input type="text" placeholder="Prénom" value={authPrenom} onChange={(e) => setAuthPrenom(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />
              </>
            )}
            
            <input type="email" placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />
            <input type="password" placeholder="Mot de passe" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />
            
            {isRegisterMode && <input type="password" placeholder="Confirmer mot de passe" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />}
            
            <button type="submit" style={{ width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", cursor: "pointer" }}>
              {isRegisterMode ? "S'inscrire" : "Se connecter"}
            </button>
  
            {/* LE LIEN EST MAINTENANT ICI, DANS LE FORMULAIRE */}
            {!isRegisterMode && (
              <p onClick={() => window.location.href = "/forgot-password"} 
                 style={{ cursor: "pointer", color: "#6c757d", textAlign: "center", marginTop: "15px", fontSize: "14px", textDecoration: "underline" }}>
                 Mot de passe oublié ?
              </p>
            )}
  
            <p onClick={() => setIsRegisterMode(!isRegisterMode)} style={{ cursor: "pointer", color: "#0d6efd", textAlign: "center", marginTop: "15px" }}>
              {isRegisterMode ? "Déjà inscrit ? Connectez-vous" : "Pas de compte ? S'inscrire"}
            </p>
          </form>
        </div>
      );
    }
    
    return (
      
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ color: "#0d47a1" }}>TABLEAU DE BORD</h1>
  
            <button onClick={handleLogout} style={{ background: "#6c757d", color: "white", padding: "8px 16px", border: "none", cursor: "pointer" }}>🚪 Déconnexion</button>
  
          </div>
          {activeTab === "users" && <UsersTab users={users} onDeleteUser={handleDeleteUser} />}
          {activeTab === "certificats" && <CertificatsTab certificats={certificats} paiements={paiements} onValiderDossier={handleValiderDossier} onDeleteCertificat={handleDeleteCertificat} getPaymentBadgeStyle={getPaymentBadgeStyle} translatePaymentStatus={translatePaymentStatus} />}
          {activeTab === "paiements" && <PaiementsTab paiements={paiements} getPaymentBadgeStyle={getPaymentBadgeStyle} translatePaymentStatus={translatePaymentStatus} />}
        </div>
      </div>
    );
}