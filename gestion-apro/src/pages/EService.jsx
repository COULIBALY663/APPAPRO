import { useNavigate } from "react-router-dom";
export default function EService() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "#0d47a1", textAlign: "center", fontSize: "40px" }}>🖥️ Service en ligne </h1>
      <p style={{color: "#475569", // Garde ce gris pro pour le texte
  fontSize: "16px",
  textAlign: "center",
  fontStyle: "italic",
  margin: "15px 0" }}>(Tous ces services concernent les documents administratifs ivoiriens, je vous remercie)</p>
    
      <p style={{
  backgroundColor: "#f8fafc", // Fond gris-blanc ultra-léger et moderne
  color: "#0f172a",           // Texte sombre pour un contraste parfait
  padding: "12px",
  borderRadius: "8px",
  textAlign: "center",
  fontWeight: "600",
  fontSize: "50px",
  border: "1px solid #e2e8f0", // Fine bordure subtile
  marginBottom: "20px"}}>
    Choisissez un service </p>
 
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        
        <button 
          onClick={() => navigate("/Certificat")}
          style={{btn,background: "#15803d", color: "white", fontSize: "18px", padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer"}}
        >
          📄 Demande de certificat de nationnalité ivoirienne
        </button>

        <button 
          onClick={() => navigate("/Casier")}
          style={{btn,background: "#1e3a8a", color: "white", fontSize: "18px", padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer"}}
        >
          📑 Demande de casier judiciaire
        </button>
        <button 
          onClick={() => navigate("/Timbre")}
          style={{btn,background: "#d97706", color: "white", fontSize: "18px", padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer"}}
        >
          📄 Demande de timbre
        </button>
        

      </div>
    </div>
  );
}

const btn = {
  padding: "15px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "none",
  background: "#15803d",
  color: "white",
  cursor: "pointer"
};