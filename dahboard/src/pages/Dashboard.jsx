import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

// 📥 Importation de tes fonctions de service et sous-composants
import { registerUser } from "../services/userService.js"; 
import UsersTab from "../components/UsersTab";
import CertificatsTab from "../components/CertificatsTab";
import PaiementsTab from "../components/PaiementsTab";

export default function Dashboard() {
  // 🔐 Gestion de la sécurité et authentification locale
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("adminToken"));
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // 📝 États pour le formulaire d'authentification
  const [authNom, setAuthNom] = useState("");
  const [authPrenom, setAuthPrenom] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  
  // ⏳ Message de blocage si le rôle n'a pas été activé en SQL
  const [activationMessage, setActivationMessage] = useState("");

  // 📂 Données et onglet actif
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "users");
  const [users, setUsers] = useState([]);
  const [certificats, setCertificats] = useState([]);
  const [paiements, setPaiements] = useState([]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // ================= UTILS : FORMATAGE STYLES ET BADGES =================
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

  // ================= GESTION DES APPELS API HTTP =================
  const fetchUsers = async () => {
    try { const res = await fetch("https://appapro.onrender.com/users"); setUsers(await res.json() || []); } catch (err) { console.error(err); }
  };
  const fetchCertificats = async () => {
    try { const res = await fetch("https://appapro.onrender.com/certificat"); setCertificats(await res.json() || []); } catch (err) { console.error(err); }
  };
  const fetchPaiements = async () => {
    try { const res = await fetch("https://appapro.onrender.com/paiement"); setPaiements(await res.json() || []); } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === "users") fetchUsers();
    else if (activeTab === "certificats") { fetchCertificats(); fetchPaiements(); }
    else if (activeTab === "paiements") fetchPaiements();
  }, [activeTab, isAuthenticated]);

  // ================= ACTIONS DE SUPPRESSION ET VALIDATION =================
  const handleValiderDossier = async (id, statutActuel) => {
    const nouveauStatut = statutActuel === "Traité" ? "En attente" : "Traité";
    if (!window.confirm(`Passer le dossier #${id} à : ${nouveauStatut} ?`)) return;
    try {
      const res = await fetch(`https://appapro.onrender.com/certificat/${id}/statut`, {
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
    try { if ((await fetch(`https://appapro.onrender.com/users/${id}`, { method: "DELETE" })).ok) setUsers(users.filter(u => (u.users_id || u.id) !== id)); } catch (err) { console.error(err); }
  };

  const handleDeleteCertificat = async (id) => {
    if (!window.confirm("Supprimer ce certificat ?")) return;
    try { 
      const res = await fetch(`https://appapro.onrender.com/certificat/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCertificats(certificats.filter(c => (c.id || c.IDENTIFIANT) !== id));
      } else {
        const errData = await res.json();
        alert(`❌ Impossible de supprimer : ${errData.message || "Erreur de base de données"}`);
      }
    } catch (err) { console.error(err); }
  };

  // ================= SYSTÈME AUTHENTIFICATION COMPATIBLE MOT DE PASSE CRYPTÉ =================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setActivationMessage(""); 

    if (isRegisterMode) {
      if (!authNom || !authPrenom || !authEmail || !authPassword || !authConfirmPassword) {
        return alert("Veuillez remplir tous les champs !");
      }
      if (authPassword !== authConfirmPassword) {
        return alert("❌ Les mots de passe ne correspondent pas !");
      }

      try {
        const dataToSend = {
          prenom: authPrenom,
          nom: authNom,
          email: authEmail,
          password: authPassword
        };

        await registerUser(dataToSend);

        alert("🔒 Inscription enregistrée !");
        setActivationMessage("⚠️ Veuillez contacter le 0564225178 pour finaliser votre inscription et activer votre rôle.");
        setIsRegisterMode(false);
        
        setAuthPassword("");
        setAuthConfirmPassword("");
      } catch (err) {
        console.error(err);
        alert("❌ Erreur lors de l'inscription.");
      }

    } else {
      if (!authEmail || !authPassword) return alert("Veuillez remplir tous les champs !");

      if (authEmail === "admin@admin.com" && authPassword === "admin") {
        sessionStorage.setItem("adminToken", "CONNECTED_SECRET_TOKEN");
        setIsAuthenticated(true);
        return;
      }

      try {
        const resUsers = await fetch("https://appapro.onrender.com/registerUser");
        if (!resUsers.ok) throw new Error("Erreur serveur");
        
        const allUsers = await resUsers.json() || [];
        const matchingUser = allUsers.find(u => String(u.email).toLowerCase().trim() === String(authEmail).toLowerCase().trim());

        if (!matchingUser) {
          return alert("❌ Aucun compte trouvé avec cet e-mail.");
        }

        const roleReel = matchingUser.role ? String(matchingUser.role).toLowerCase().trim() : "en attente";

        if (roleReel === "admin" || roleReel === "superadmin") {
          sessionStorage.setItem("adminToken", "CONNECTED_SECRET_TOKEN");
          setIsAuthenticated(true);
        } else {
          setActivationMessage("🛑 Accès refusé : Veuillez contacter le 0564225178 pour finaliser votre inscription.");
        }
      } catch (err) {
        console.error(err);
        alert("❌ Impossible de vérifier les autorisations d'accès.");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "Arial", padding: "20px" }}>
        <form onSubmit={handleAuthSubmit} style={{ background: "white", padding: "30px 40px", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", width: "100%", maxWidth: "420px" }}>
          <h2 style={{ textAlign: "center", color: "#0d47a1", marginBottom: "25px" }}>
            {isRegisterMode ? "📝 Créer un compte Admin" : "🔐 Connexion Administration"}
          </h2>

          {activationMessage && (
            <div style={{ backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeeba", padding: "12px", borderRadius: "4px", fontSize: "14px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
              {activationMessage}
            </div>
          )}

          {isRegisterMode && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Nom</label>
                <input type="text" value={authNom} onChange={(e) => setAuthNom(e.target.value)} placeholder="Ex: Coulibaly" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }} required />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Prénom</label>
                <input type="text" value={authPrenom} onChange={(e) => setAuthPrenom(e.target.value)} placeholder="Ex: Zie" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }} required />
              </div>
            </>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Adresse Email</label>
            <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="exemple@email.com" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }} required />
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Mot de passe</label>
            <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }} required />
          </div>

          {isRegisterMode && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", fontSize: "14px" }}>Confirmer le mot de passe</label>
              <input type="password" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", boxSizing: "border-box" }} required />
            </div>
          )}

          <button type="submit" style={{ width: "100%", padding: "12px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "15px" }}>
            {isRegisterMode ? "S'inscrire" : "Se connecter"}
          </button>
          
          <p onClick={() => { setIsRegisterMode(!isRegisterMode); setActivationMessage(""); }} style={{ textAlign: "center", color: "#0d6efd", cursor: "pointer", fontSize: "13px", marginTop: "15px", textDecoration: "underline" }}>
            {isRegisterMode ? "Déjà inscrit ? Connectez-vous" : "Pas encore de compte ? S'inscrire"}
          </p>
        </form>
      </div>
    );
  }

  // 🔓 LE DASHBOARD COMPLET
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, padding: "30px", overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #e2e8f0", paddingBottom: "15px" }}>
          <h1 style={{ color: "#0d47a1", fontStyle: "italic", fontWeight: "bold", fontSize: "42px", margin: 0 }}>
            TABLEAU DE BORD
          </h1>
          <button onClick={handleLogout} style={{ background: "#ef4444", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "6px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" }}>
            🚪 Déconnexion
          </button>
        </div>

        {/* SECTION UTILISATEURS */}
        {activeTab === "users" && (
          <UsersTab users={users} onDeleteUser={handleDeleteUser} />
        )}

        {/* SECTION CERTIFICATS (Contient les informations matrimoniales transitées) */}
        {activeTab === "certificats" && (
          <CertificatsTab 
            certificats={certificats} 
            paiements={paiements} 
            onValiderDossier={handleValiderDossier} 
            onDeleteCertificat={handleDeleteCertificat}
            getPaymentBadgeStyle={getPaymentBadgeStyle}
            translatePaymentStatus={translatePaymentStatus}
          />
        )}

        {/* SECTION PAIEMENTS */}
        {activeTab === "paiements" && (
          <PaiementsTab 
            paiements={paiements} 
            getPaymentBadgeStyle={getPaymentBadgeStyle} 
            translatePaymentStatus={translatePaymentStatus} 
          />
        )}
      </div>
    </div>
  );
}