export default function Contact() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px",
        fontFamily: "Arial",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "50px",
            marginBottom: "20px",
            color: "#22c55e",
          }}
        >
          Contactez-nous
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "40px",
          }}
        >
          Nous sommes disponibles pour répondre à
          toutes vos préoccupations.
        </p>

        <div style={{ marginBottom: "30px" }}>
          <h3>📞 Téléphone</h3>
          <p>0564225178</p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3>💬 WhatsApp</h3>
          <p>0564225178</p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3>📍 Localisation</h3>
          <p>Abidjan, Côte d’Ivoire</p>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3>📧 Email</h3>
          <p>academiepro@gmail.com</p>
        </div>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Votre nom"
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Votre email"
            style={inputStyle}
          />

          <textarea
            placeholder="Votre message"
            rows="5"
            style={inputStyle}
          ></textarea>

          <button style={btnStyle}>
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
};

const btnStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "15px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};