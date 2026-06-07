import { useNavigate } from "react-router-dom";

export default function Documents() {
  const navigate = useNavigate();

  const handleAddDocument = () => {
    alert("Ajouter un document cliqué !");
  };

  const handleAddDocument1 = () => {
    alert("Consulter les listes des formations disponible cliqué !");
  };

  const handleAddDocument2 = () => {
    alert("Consulter les autres services d'académie pro !");
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Injection des animations Hover */}
      <style>{`
        .action-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .action-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.15) !important;
          filter: brightness(1.1);
        }
      `}</style>

      {/* 🍊 BANNIÈRE TITRE RESPONSIVE */}
      <div
        style={{
          background: "linear-gradient(135deg, #E67E22 0%, #D35400 100%)", // Dégradé plus moderne
          color: "white",
          padding: "clamp(20px, 4vw, 40px) 20px", // S'adapte sur mobile
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(211, 84, 0, 0.2)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(22px, 4vw, 36px)", // Ne déborde pas sur petit écran
            fontWeight: "800",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
          }}
        >
          Bienvenue dans les services d'Académie Pro
        </h1>
      </div>

      {/* 🎛️ GRILLE DES BOUTONS RESPONSIVE */}
      <div
        style={{
          display: "grid",
          // S'aligne sur 1 colonne sur mobile, et répartit équitablement jusqu'à 4 sur PC
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "20px",
          padding: "clamp(20px, 5vw, 40px) clamp(15px, 5vw, 40px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* 🔵 Bouton 1 */}
        <button
          className="action-btn"
          onClick={handleAddDocument}
          style={buttonStyle("linear-gradient(135deg, #3b82f6, #1d4ed8)")}
        >
          📄 Ajouter un rapport <br /> à mettre en forme
        </button>

        {/* 🟢 Bouton 2 */}
        <button
          className="action-btn"
          onClick={handleAddDocument1}
          style={buttonStyle("linear-gradient(135deg, #10b981, #047857)")}
        >
          🎓 Consulter les listes des <br /> formations disponibles
        </button>

        {/* 🟣 Bouton 3 */}
        <button
          className="action-btn"
          onClick={handleAddDocument2}
          style={buttonStyle("linear-gradient(135deg, #8b5cf6, #6d28d9)")}
        >
          🚀 Consulter les autres <br /> services d'académie pro
        </button>

        {/* 🟠 Bouton 4 (Remplacé par un vrai bouton sémantique) */}
        <button
          className="action-btn"
          onClick={() => navigate("/eservice")}
          style={buttonStyle("linear-gradient(135deg, #f97316, #ea580c)")}
        >
          🌐 Accéder aux e-services <br /> d'académie pro
        </button>
      </div>
    </div>
  );
}

//
// 🎨 STYLE DESIGN PREMIUM & FLEXIBLE
//
const buttonStyle = (gradientBackground) => ({
  background: gradientBackground,
  color: "white",
  padding: "30px 20px",
  border: "none",
  borderRadius: "24px", // Un arrondi à 24px fait beaucoup plus moderne et pro que 40px
  fontSize: "16px",
  fontWeight: "700",
  lineHeight: "1.4",
  cursor: "pointer",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "110px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
});