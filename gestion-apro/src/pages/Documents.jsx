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
    <div>
      {/* 🔥 TITRE */}
      <h1
        style={{
          backgroundColor: "#D35400",
          color: "white",
          padding: "15px",
          textAlign: "center",
          fontSize: "40px",
        }}
      >
        BIENVENU DANS LES SERVICES D'ACADEMIE PRO
      </h1>

      {/* 🔥 CONTENEUR DES BOUTONS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "20px",
        }}
      >
        {/* 🔵 Bouton 1 */}
        <button onClick={handleAddDocument} style={buttonStyle("blue")}>
          Ajouter un rapport <br /> à mettre en forme
        </button>

        {/* 🟢 Bouton 2 */}
        <button onClick={handleAddDocument1} style={buttonStyle("green")}>
          Consulter les listes des <br /> formations disponibles
        </button>

        {/* 🟣 Bouton 3 */}
        <button onClick={handleAddDocument2} style={buttonStyle("purple")}>
          Consulter les autres <br /> services d'académie pro
        </button>

        {/* 🟠 Bouton 4 (à droite) */}
        <div
          onClick={() => navigate("/eservice")}
          style={{
            ...buttonStyle("orange"),
             // 🔥 pousse à droite
          }}
        >
          Accéder aux e-services <br /> d'académie pro
        </div>
      </div>
    </div>
  );
}

//
// 🎨 STYLE GLOBAL DES BOUTONS
//
const buttonStyle = (color) => ({
  backgroundColor: color,
  color: "white",
  padding: "25px",
  border: "none",
  borderRadius: "40px",
  fontSize: "18px",
  cursor: "pointer",
  minWidth: "250px",
  textAlign: "center",
});