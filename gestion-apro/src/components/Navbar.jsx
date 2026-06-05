import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 50px",
        background: "#02152b",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
      }}
    >
      {/* LOGO */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
        <img
          src={logo}
          alt="Académie Pro Logo"
          style={{
            height: "65px",
            width: "65px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />

        <div>
          <h2
            style={{
              margin: 0,
              color: "#22c55e",
              fontSize: "28px",
            }}
          >
            ACADÉMIE PRO
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#cbd5e1",
            }}
          >
            Services numériques & Informatique
          </p>
        </div>
      </Link>

      {/* MENU */}
      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={linkStyle}>
          Accueil
        </Link>

        <Link to="/documents" style={linkStyle}>
          Documents
        </Link>

        <Link to="/formations" style={linkStyle}>
          Formations
        </Link>

        <Link to="/marche" style={linkStyle}>
          Marché PC
        </Link>

        <Link to="/chat" style={linkStyle}>
          Chat
        </Link>

        <Link to="/apropos" style={linkStyle}>
          À propos
        </Link>

        <Link to="/contact" style={linkStyle}>
          Contact
        </Link>
      </div>

      {/* BOUTONS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <Link to="/login">
          <button style={loginBtn}>Se connecter</button>
        </Link>

        <Link to="/register">
          <button style={registerBtn}>S'inscrire</button>
        </Link>
      </div>
    </nav>
  );
}

/* STYLES */

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "16px",
};

const loginBtn = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const registerBtn = {
  background: "#22c55e",
  border: "none",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};