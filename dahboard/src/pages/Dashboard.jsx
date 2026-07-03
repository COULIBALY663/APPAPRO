import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { registerUser } from "../services/userService.js"; 
import UsersTab from "../components/UsersTab";
import CertificatsTab from "../components/CertificatsTab";
import PaiementsTab from "../components/PaiementsTab";
import { io } from "socket.io-client";

// Configuration
const API_URL = import.meta.env.VITE_API_URL || "https://appapro.onrender.com";
const PUBLIC_VAPID_KEY = "BOr-NIMyQGxFDTuSXoP6XOldQD702RuUuSYsNjQBRTF7d8k37qPOUjE1E1soJ_A3XgU8d9bUpOsHK9E27mGxV2c";
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

  // --- Helpers Notifications ---
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
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
      console.log("✅ Notifications activées.");
    } catch (err) { console.error("❌ Erreur Push :", err); }
  }

  // --- Effets ---
  useEffect(() => { localStorage.setItem("activeTab", activeTab); }, [activeTab]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if ("Notification" in window && Notification.permission === "granted") activerNotifications();
    
    socket.on("nouvelle-demande", () => {
      fetchUsers(); fetchCertificats(); fetchPaiements();
      new Audio("/notification.mp3").play();
    });
    return () => socket.off("nouvelle-demande");
  }, [isAuthenticated]);

  // --- API Calls ---
  const fetchUsers = async () => { try { const r = await fetch(`${API_URL}/users`); setUsers(await r.json() || []); } catch (e) { console.error(e); } };
  const fetchCertificats = async () => { try { const r = await fetch(`${API_URL}/certificat`); setCertificats(await r.json() || []); } catch (e) { console.error(e); } };
  const fetchPaiements = async () => { try { const r = await fetch(`${API_URL}/paiement`); setPaiements(await r.json() || []); } catch (e) { console.error(e); } };

  useEffect(() => { if (isAuthenticated) { fetchUsers(); fetchCertificats(); fetchPaiements(); } }, [isAuthenticated]);

  // --- Actions ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      if (authPassword !== authConfirmPassword) return alert("❌ Mots de passe différents !");
      try {
        await registerUser({ prenom: authPrenom, nom: authNom, email: authEmail, password: authPassword });
        alert("Inscription enregistrée !"); setActivationMessage("Contactez le 0564225178 pour activation."); setIsRegisterMode(false);
      } catch (err) { alert("Erreur inscription."); }
    } else {
      try {
        const loginRes = await fetch(`${API_URL}/login/connexion`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword }),
        });
        if (!loginRes.ok) return alert("Email ou mot de passe incorrect");
        const loginData = await loginRes.json();
        sessionStorage.setItem("adminToken", loginData.access_token);
        setIsAuthenticated(true);
      } catch (err) { alert("Erreur de connexion"); }
    }
  };

  const handleLogout = () => { sessionStorage.removeItem("adminToken"); window.location.reload(); };

  // --- RENDER ---
  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f3f4f6", padding: "20px" }}>
        <form onSubmit={handleAuthSubmit} style={{ background: "white", padding: "30px", borderRadius: "8px", width: "100%", maxWidth: "400px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ textAlign: "center", color: "#0d47a1" }}>{isRegisterMode ? "Inscription" : "Connexion Admin"}</h2>
          {activationMessage && <div style={{ color: "#856404", background: "#fff3cd", padding: "10px", marginBottom: "15px" }}>{activationMessage}</div>}
          
          {isRegisterMode && (<><input type="text" placeholder="Nom" onChange={e => setAuthNom(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required /><input type="text" placeholder="Prénom" onChange={e => setAuthPrenom(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required /></>)}
          <input type="email" placeholder="Email" onChange={e => setAuthEmail(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />
          <input type="password" placeholder="Mot de passe" onChange={e => setAuthPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />
          {isRegisterMode && <input type="password" placeholder="Confirmer mot de passe" onChange={e => setAuthConfirmPassword(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} required />}
          
          <button type="submit" style={{ width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", cursor: "pointer" }}>{isRegisterMode ? "S'inscrire" : "Se connecter"}</button>

          {!isRegisterMode && (
            <p onClick={() => window.location.href = "/forgot-password"} style={{ cursor: "pointer", color: "#6c757d", textAlign: "center", marginTop: "15px", fontSize: "14px", textDecoration: "underline" }}>
              Mot de passe oublié ?
            </p>
          )}
          <p onClick={() => setIsRegisterMode(!isRegisterMode)} style={{ cursor: "pointer", color: "blue", textAlign: "center", marginTop: "15px" }}>{isRegisterMode ? "Déjà inscrit ?" : "Pas de compte ?"}</p>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>TABLEAU DE BORD</h1>
          <div>
            <button onClick={activerNotifications} style={{ background: "#28a745", color: "white", padding: "8px 16px", border: "none", marginRight: "10px", cursor: "pointer" }}>🔔 Push</button>
            <button onClick={handleLogout} style={{ background: "#6c757d", color: "white", padding: "8px 16px", border: "none", cursor: "pointer" }}>Déconnexion</button>
          </div>
        </div>
        {activeTab === "users" && <UsersTab users={users} />}
        {activeTab === "certificats" && <CertificatsTab certificats={certificats} paiements={paiements} />}
        {activeTab === "paiements" && <PaiementsTab paiements={paiements} />}
      </div>
    </div>
  );
}