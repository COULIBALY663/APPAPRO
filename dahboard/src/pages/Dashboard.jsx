import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { registerUser } from "../services/userService.js"; 
import UsersTab from "../components/UsersTab";
import CertificatsTab from "../components/CertificatsTab";
import PaiementsTab from "../components/PaiementsTab";

// URL dynamique : prend la valeur définie dans Render, sinon celle du backend par défaut
const API_URL = import.meta.env.VITE_API_URL || "https://appapro.onrender.com";

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

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // ================= UTILITAIRES =================
  const getPaymentBadgeStyle = (statut) => {
    const baseStyle = { padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "inline-block", textAlign: "center", border: "none", width: "100%", maxWidth: "160px" };
    const norm = String(statut || "").toLowerCase().trim();
    if (["paid", "success", "completed"].includes(norm)) return { ...baseStyle, backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" };
    if (["processing", "pending"].includes(norm)) return { ...baseStyle, backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" };
    return { ...baseStyle, backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" };
  };

  const translatePaymentStatus = (statut) => {
    const norm = String(statut || "").toLowerCase().trim();
    if (["paid", "success", "completed"].includes(norm)) return "✅ Payé";
    if (["processing", "pending"].includes(norm)) return "⏳ En cours...";
    return "🛑 Échoué / Non initié";
  };

  // ================= GESTION APPELS API =================
  const fetchUsers = async () => {
    try { const res = await fetch(`${API_URL}/users`); setUsers(await res.json() || []); } catch (err) { console.error(err); }
  };
  const fetchCertificats = async () => {
    try { const res = await fetch(`${API_URL}/certificat`); setCertificats(await res.json() || []); } catch (err) { console.error(err); }
  };
  const fetchPaiements = async () => {
    try { const res = await fetch(`${API_URL}/paiement`); setPaiements(await res.json() || []); } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === "users") fetchUsers();
    else if (activeTab === "certificats") { fetchCertificats(); fetchPaiements(); }
    else if (activeTab === "paiements") fetchPaiements();
  }, [activeTab, isAuthenticated]);

  // ================= ACTIONS =================
  const handleValiderDossier = async (id, statutActuel) => {
    const nouveauStatut = statutActuel === "Traité" ? "En attente" : "Traité";
    if (!window.confirm(`Passer le dossier #${id} à : ${nouveauStatut} ?`)) return;
    try {
      const res = await fetch(`${API_URL}/certificat/${id}/statut`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      if (res.ok) {
        setCertificats(prev => prev.map(c => ((c.id || c.IDENTIFIANT) === id ? { ...c, statut: nouveauStatut } : c)));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try { if ((await fetch(`${API_URL}/users/${id}`, { method: "DELETE" })).ok) setUsers(users.filter(u => (u.users_id || u.id) !== id)); } catch (err) { console.error(err); }
  };

  const handleDeleteCertificat = async (id) => {
    if (!window.confirm("Supprimer ce certificat ?")) return;
    try { 
      const res = await fetch(`${API_URL}/certificat/${id}`, { method: "DELETE" });
      if (res.ok) setCertificats(certificats.filter(c => (c.id || c.IDENTIFIANT) !== id));
      else alert("Erreur lors de la suppression.");
    } catch (err) { console.error(err); }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      if (authPassword !== authConfirmPassword) return alert("Les mots de passe ne correspondent pas !");
      try {
        await registerUser({ prenom: authPrenom, nom: authNom, email: authEmail, password: authPassword });
        alert("Inscription enregistrée !");
        setIsRegisterMode(false);
      } catch (err) { alert("Erreur inscription."); }
    } else {
        // Logique connexion simplifiée
        if (authEmail === "admin@admin.com" && authPassword === "admin") {
            sessionStorage.setItem("adminToken", "TRUE");
            setIsAuthenticated(true);
        } else {
            alert("Accès refusé.");
        }
    }
  };

  const handleLogout = () => { sessionStorage.removeItem("adminToken"); setIsAuthenticated(false); };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <form onSubmit={handleAuthSubmit}>
          <h2>{isRegisterMode ? "Inscription" : "Connexion Admin"}</h2>
          <input type="email" placeholder="Email" onChange={(e) => setAuthEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" onChange={(e) => setAuthPassword(e.target.value)} required />
          <button type="submit">{isRegisterMode ? "S'inscrire" : "Se connecter"}</button>
          <p onClick={() => setIsRegisterMode(!isRegisterMode)} style={{cursor:'pointer'}}>Changer de mode</p>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>TABLEAU DE BORD</h1>
        <button onClick={handleLogout}>Déconnexion</button>
        {activeTab === "users" && <UsersTab users={users} onDeleteUser={handleDeleteUser} />}
        {activeTab === "certificats" && <CertificatsTab certificats={certificats} paiements={paiements} onValiderDossier={handleValiderDossier} onDeleteCertificat={handleDeleteCertificat} />}
        {activeTab === "paiements" && <PaiementsTab paiements={paiements} />}
      </div>
    </div>
  );
}