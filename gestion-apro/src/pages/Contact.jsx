export default function Contact() {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Contactez-nous</h1>
        <p style={subtitleStyle}>Nous sommes à votre écoute.</p>

        {/* Liens interactifs */}
        <div style={{ marginBottom: "30px" }}>
          <h3>📞 Téléphone / WhatsApp</h3>
          <a href="tel:+2250564225178" style={linkStyle}>+225 05 64 22 51 78</a>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <h3>📧 Email</h3>
          <a href="mailto:academiepro@gmail.com" style={linkStyle}>academiepro@gmail.com</a>
        </div>

        <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Votre nom" style={inputStyle} required />
          <input type="email" placeholder="Votre email" style={inputStyle} required />
          <textarea placeholder="Votre message" rows="5" style={inputStyle} required></textarea>
          <button type="submit" style={btnStyle}>Envoyer le message</button>
        </form>
      </div>
    </div>
  );
}

// Styles optimisés
const containerStyle = { minHeight: "100vh", padding: "20px", background: "#f8fafc", fontFamily: "sans-serif" };
const cardStyle = { maxWidth: "600px", margin: "auto", background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" };
const titleStyle = { textAlign: "center", color: "#22c55e", marginBottom: "10px" };
const subtitleStyle = { textAlign: "center", color: "#64748b", marginBottom: "30px" };
const linkStyle = { color: "#22c55e", textDecoration: "none", fontWeight: "bold" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputStyle = { padding: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "16px" };
const btnStyle = { background: "#22c55e", color: "white", border: "none", padding: "15px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" };