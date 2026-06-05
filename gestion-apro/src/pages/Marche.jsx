export default function Marche() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: "Arial",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "60px",
          color: "#22c55e",
          marginBottom: "20px",
        }}
      >
        💻 Marché PC
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#475569",
          maxWidth: "700px",
        }}
      >
        Notre espace de vente d’ordinateurs et accessoires
        informatiques sera bientôt disponible.
      </p>

      <button
        style={{
          marginTop: "30px",
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "15px 30px",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Nous contacter
      </button>
    </div>
  );
}