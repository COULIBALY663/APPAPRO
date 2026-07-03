import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { registerUser } from "../services/userService.js"; 
import UsersTab from "../components/UsersTab";
import CertificatsTab from "../components/CertificatsTab";
import PaiementsTab from "../components/PaiementsTab";
import { io } from "socket.io-client";

// 🌐 URL dynamique : utilise la variable d'environnement ou le local par défaut
const API_URL = import.meta.env.VITE_API_URL || "https://appapro.onrender.com";
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

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  useEffect(() => {
  if (!isAuthenticated) return;

  const initNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Votre navigateur ne supporte pas les notifications.");
      return;
    }

    // Si l'utilisateur n'a jamais répondu
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Les notifications sont obligatoires pour utiliser ce tableau de bord.");
        sessionStorage.removeItem("adminToken");
        window.location.reload();
        return;
      }
    }

    // Si elles sont refusées
    if (Notification.permission === "denied") {
      alert("Veuillez autoriser les notifications dans les paramètres du navigateur.");
      sessionStorage.removeItem("adminToken");
      window.location.reload();
      return;
    }

    // Si elles sont autorisées
    activerNotifications();
  };

  initNotifications();

  socket.on("nouvelle-demande", () => {
    fetchUsers();
    fetchCertificats();
    fetchPaiements();

    if (Notification.permission === "granted") {
      new Notification("📢 Nouvelle demande", {
        body: "Un nouvel utilisateur vient d'envoyer un dossier.",
        icon: "/logo.png",
      });
    }

    new Audio("/notification.mp3").play();
  });

  return () => {
    socket.off("nouvelle-demande");
  };
}, [isAuthenticated]);

  // ================= UTILS =================
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

  // ================= APPELS API =================
  const fetchUsers = async () => {
    try { const res = await fetch(`${API_URL}/users`); setUsers(await res.json() || []); } catch (err) { console.error(err); }
  };
  const fetchCertificats = async () => {
    try { const res = await fetch(`${API_URL}/certificat`); setCertificats(await res.json() || []); } catch (err) { console.error(err); }
  };
  const fetchPaiements = async () => {
    try { const res = await fetch(`${API_URL}/paiement`); setPaiements(await res.json() || []); } catch (err) { console.error(err); }
  };

  // Chargement automatique des données
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUsers();
    fetchCertificats();
    fetchPaiements();
  }, [isAuthenticated]);

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
    if (isRegisterMode) {
      if (authPassword !== authConfirmPassword) return alert("❌ Les mots de passe ne correspondent pas !");
      try {
        await registerUser({ prenom: authPrenom, nom: authNom, email: authEmail, password: authPassword });
        alert("🔒 Inscription enregistrée !");
        setActivationMessage("⚠️ Veuillez contacter le 0564225178 pour activation.");
        setIsRegisterMode(false);
      } catch (err) { alert("❌ Erreur inscription."); }
    } else {
      try {
  // Vérification email + mot de passe
  const loginRes = await fetch(`${API_URL}/login/connexion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: authEmail,
      password: authPassword,
    }),
  });

  if (!loginRes.ok) {
    return alert("Email ou mot de passe incorrect");
  }

  // Récupération des utilisateurs pour vérifier le rôle
  const usersRes = await fetch(`${API_URL}/users`);
  const users = await usersRes.json();

  const user = users.find(
    (u) =>
      String(u.email).toLowerCase().trim() ===
      String(authEmail).toLowerCase().trim()
  );

  if (
    !user ||
    !["admin", "superadmin"].includes(
      String(user.role).toLowerCase().trim()
    )
  ) {
    return alert("Accès réservé aux administrateurs, veillez contacter le 0564225178 pour activation.");
  }

  // Connexion réussie
  const loginData = await loginRes.json();

  sessionStorage.setItem(
    "adminToken",
    loginData.access_token
  );

  setIsAuthenticated(true);

} catch (err) {
  console.error(err);
  alert("Erreur de connexion");
}
}
  }
  const PUBLIC_VAPID_KEY =
  "BOr-NIMyQGxFDTuSXoP6XOldQD702RuUuSYsNjQBRTF7d8k37qPOUjE1E1soJ_A3XgU8d9bUpOsHK9E27mGxV2c";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

async function activerNotifications() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });
      }
      await fetch(`${API_URL}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      console.log("✅ Notifications activées et enregistrées.");
    } catch (err) { console.error("❌ Erreur Push :", err); }
  }
  const handleLogout = () => { sessionStorage.removeItem("adminToken"); window.location.reload(); };

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