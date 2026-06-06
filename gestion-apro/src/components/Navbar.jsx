import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Menu mobile
  const [authView, setAuthView] = useState({ show: false, type: "" }); // Fenêtre de choix

  const triggerAuth = (type) => {
    setIsOpen(false);
    setAuthView({ show: true, type });
  };

  return (
    <>
      <nav style={navStyle}>
        {/* 1. SECTION LOGO */}
        <Link to="/" style={logoContainerStyle} className="clickable-link">
          <img src={logo} alt="Académie Pro Logo" style={logoImgStyle} />
          <div style={logoTextStyle}>
            <h2 style={logoTitleStyle}>ACADÉMIE PRO</h2>
            <p style={logoSubTitleStyle}>Services numériques & Informatique</p>
          </div>
        </Link>

        {/* BOUTON BURGER (MOBILE) */}
        <button style={burgerButtonStyle} onClick={() => setIsOpen(!isOpen)} className="burger-effect">
          {isOpen ? "✖" : "☰"}
        </button>

        {/* 2. TOUS LES LIENS D'ORIGINE */}
        <div style={{ ...menuStyle, display: isOpen ? "flex" : "" }} className="nav-links">
          <Link to="/" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">Accueil</Link>
          <Link to="/documents" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">Documents</Link>
          <Link to="/formations" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">Formations</Link>
          <Link to="/marche" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">Marché PC</Link>
          <Link to="/chat" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">Chat</Link>
          <Link to="/apropos" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">À propos</Link>
          <Link to="/contact" style={linkStyle} onClick={() => setIsOpen(false)} className="clickable-link">Contact</Link>
        </div>

        {/* 3. BOUTONS D'ACTION */}
        <div style={{ ...buttonsContainerStyle, display: isOpen ? "flex" : "" }} className="nav-buttons">
          <button style={loginBtn} onClick={() => triggerAuth("login")} className="btn-effect-login">Se connecter</button>
          <button style={registerBtn} onClick={() => triggerAuth("register")} className="btn-effect-register">S'inscrire</button>
        </div>
      </nav>

      {/* 🌟 INTERFACE DE CHOIX ANIMÉE (MODAL) */}
      {authView.show && (
        <div style={overlayStyle} onClick={() => setAuthView({ show: false, type: "" })}>
          <div 
            style={modalCardStyle} 
            onClick={(e) => e.stopPropagation()} 
            className="auth-card-animation"
          >
            <button style={closeBtn} onClick={() => setAuthView({ show: false, type: "" })}>✕</button>
            
            <h2 style={modalTitle}>
              {authView.type === "login" ? "Bon retour parmi nous !" : "Rejoindre l'aventure"}
            </h2>
            <p style={modalText}>Sélectionnez votre méthode préférée pour continuer sur Académie Pro.</p>

            <div style={optionsWrapper}>
              {/* BOUTON GOOGLE ANIMÉ */}
              <button style={googleOptionBtn} className="google-hover-effect" onClick={() => alert(`Google Auth (${authView.type})`)}>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{marginRight: '12px'}}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {authView.type === "login" ? "Se connecter avec Google" : "S'inscrire avec Google"}
              </button>

              <div style={divider}><span>OU</span></div>

              {/* BOUTON EMAIL CLASSIQUE */}
              <Link 
                to={authView.type === "login" ? "/login" : "/register"} 
                style={emailOptionBtn} 
                className="email-hover-effect"
                onClick={() => setAuthView({ show: false, type: "" })}
              >
                Continuer avec un Email
              </Link>
            </div>

            <p style={switchText}>
              {authView.type === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}
              <span 
                style={switchLink} 
                onClick={() => setAuthView({ ...authView, type: authView.type === "login" ? "register" : "login" })}
              >
                {authView.type === "login" ? " Créer un compte" : " Se connecter"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ⚡ STYLES CSS COMPLETS AVEC LES NOUVELLES ANIMATIONS AU CLIC */}
      <style>{`
        .nav-links, .nav-buttons { display: flex !important; }

        /* ✨ EFFET DE CLIGNOTEMENT / GLOW SUR LES LIENS */
        .clickable-link {
          transition: all 0.2s ease-in-out;
          position: relative;
        }
        /* Au survol : Devient vert et s'agrandit légèrement */
        .clickable-link:hover {
          color: #22c55e !important;
          transform: scale(1.05);
        }
        /* AU CLIC (L'effet "clignoter" que tu as demandé) */
        .clickable-link:active {
          transform: scale(0.92); /* Effet d'enfoncement */
          opacity: 0.4; /* Clignotement flash instantané */
          color: #15803d !important; /* Vert plus foncé très bref */
        }

        /* Effet au clic sur le bouton se connecter */
        .btn-effect-login { transition: all 0.2s ease; }
        .btn-effect-login:hover { background: rgba(34, 197, 94, 0.1); }
        .btn-effect-login:active { transform: scale(0.95); opacity: 0.6; }

        /* Effet au clic sur le bouton s'inscrire */
        .btn-effect-register { transition: all 0.2s ease; }
        .btn-effect-register:hover { background: #16a34a !important; }
        .btn-effect-register:active { transform: scale(0.95); opacity: 0.6; }

        /* Animation Burger Mobile */
        .burger-effect:active { transform: scale(0.85); opacity: 0.5; }

        /* Animations Modal */
        .auth-card-animation {
          animation: slideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Effets de Survol Modal */
        .google-hover-effect { transition: all 0.25s ease; }
        .google-hover-effect:hover {
          background: #f8fafc !important;
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.4) !important;
          transform: translateY(-2px);
        }
        .google-hover-effect:active { transform: scale(0.96); opacity: 0.5; }

        .email-hover-effect { transition: all 0.25s ease; }
        .email-hover-effect:hover {
          background: #22c55e !important;
          color: white !important;
          transform: translateY(-2px);
        }
        .email-hover-effect:active { transform: scale(0.96); opacity: 0.5; }

        /* 📱 RESPONSIVE MOBILE */
        @media (max-width: 1150px) {
          nav { padding: 15px 20px !important; }
          button[style*="font-size: 26px"] { display: block !important; }
          .nav-links {
            display: none !important;
            flex-direction: column !important;
            width: 100% !important;
            order: 2;
            gap: 15px !important;
            padding: 20px 0 10px 0;
            border-top: 1px solid #1e293b;
            margin-top: 12px;
          }
          .nav-buttons {
            display: none !important;
            flex-direction: column !important;
            width: 100% !important;
            order: 3;
            padding-top: 10px;
            gap: 12px !important;
          }
          .nav-links[style*="display: flex"], 
          .nav-buttons[style*="display: flex"] { display: flex !important; }
          .nav-buttons button { width: 100% !important; }
        }
      `}</style>
    </>
  );
}

/* 🎨 STYLES DE BASE (ALIGNEMENT OPTIMISÉ) */
const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 4%", background: "#02152b", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 4px 15px rgba(0,0,0,0.3)", flexWrap: "wrap" };
const logoContainerStyle = { display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" };
const logoImgStyle = { height: "52px", width: "52px", borderRadius: "10px", objectFit: "cover" };
const logoTextStyle = { display: "flex", flexDirection: "column" };
const logoTitleStyle = { margin: 0, color: "#22c55e", fontSize: "22px", fontWeight: "bold" };
const logoSubTitleStyle = { margin: 0, fontSize: "11px", color: "#cbd5e1" };

const burgerButtonStyle = { display: "none", background: "none", border: "none", color: "white", fontSize: "26px", cursor: "pointer" };
const menuStyle = { display: "flex", gap: "22px", alignItems: "center" };
const linkStyle = { color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "15px" };

const buttonsContainerStyle = { display: "flex", gap: "15px", alignItems: "center" };
const loginBtn = { background: "transparent", border: "1px solid #22c55e", color: "#22c55e", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const registerBtn = { background: "#22c55e", border: "none", color: "white", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };

/* 🌟 MODAL STYLES */
const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(2, 21, 43, 0.85)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 };
const modalCardStyle = { background: "#ffffff", padding: "40px", borderRadius: "24px", width: "420px", maxWidth: "90%", textAlign: "center", position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.4)", border: "1px solid #e2e8f0" };
const closeBtn = { position: "absolute", top: "20px", right: "20px", border: "none", background: "none", fontSize: "18px", cursor: "pointer", color: "#94a3b8" };
const modalTitle = { color: "#02152b", fontSize: "24px", marginBottom: "8px", fontWeight: "bold" };
const modalText = { color: "#64748b", fontSize: "14px", marginBottom: "25px" };
const optionsWrapper = { display: "flex", flexDirection: "column", gap: "15px" };
const googleOptionBtn = { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "white", color: "#02152b", fontWeight: "bold", fontSize: "15px", cursor: "pointer" };
const emailOptionBtn = { display: "block", textDecoration: "none", width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #22c55e", background: "transparent", color: "#22c55e", fontWeight: "bold", fontSize: "15px", textAlign: "center", boxSizing: "border-box" };
const divider = { margin: "10px 0", fontSize: "11px", color: "#cbd5e1", display: "flex", alignItems: "center", gap: "10px", width: "100%" };
const switchText = { marginTop: "25px", fontSize: "13px", color: "#64748b" };
const switchLink = { color: "#22c55e", fontWeight: "bold", cursor: "pointer" };