"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const services = [
    {
      title: "Documents Administratifs",
      desc: "Certificats, attestations, actes et autres documents officiels.",
      icon: "📄",
    },
    {
      title: "Formations Informatiques",
      desc: "Formations pratiques pour tous les niveaux.",
      icon: "🎓",
    },
    {
      title: "Services Numériques",
      desc: "Impressions, photocopies, scans, saisies et plus.",
      icon: "🖨️",
    },
    {
      title: "Vente d’Ordinateurs",
      desc: "Ordinateurs, accessoires et équipements informatiques.",
      icon: "💻",
    },
    {
      title: "Assistance Technique",
      desc: "Dépannage, maintenance et support technique.",
      icon: "🎧",
    },
    {
      title: "Accompagnement Personnalisé",
      desc: "Nous vous accompagnons dans vos projets.",
      icon: "🚀",
    },
  ];

  const products = [
    {
      name: "HP EliteBook 840 G5",
      price: "250 000 FCFA",
      image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    },
    {
      name: "Dell Latitude 5490",
      price: "230 000 FCFA",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
    {
      name: "Lenovo ThinkPad X1",
      price: "420 000 FCFA",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      name: "HP ProBook 450",
      price: "220 000 FCFA",
      image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
    },
  ];

  // État dynamique pour les avis clients
  const [avisClients, setAvisClients] = useState([]);

  // États pour contrôler le formulaire d'ajout d'avis
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelleNote, setNouvelleNote] = useState(5);
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");

  // Charger les commentaires depuis NestJS au démarrage
  useEffect(() => {
    fetch("https://appapro.onrender.com/commentaires")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filtrer pour ne garder que les avis actifs (si la propriété 'actif' existe)
          const actifs = data.filter((avis) => avis.actif !== false);
          setAvisClients(actifs);
        }
      })
      .catch((err) => console.error("Erreur de chargement des avis :", err));
  }, []);

  // Fonction pour soumettre un nouvel avis vers NestJS
  const ajouterAvis = async (e) => {
    e.preventDefault();
    if (!nouveauNom.trim() || !nouveauCommentaire.trim()) return;

    try {
      const response = await fetch("https://appapro.onrender.com/commentaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: nouveauNom,
          note: Number(nouvelleNote),
          commentaire: nouveauCommentaire,
        }),
      });

      if (response.ok) {
        const nouvelAvisEnregistre = await response.json();
        
        // Ajoute le nouvel avis renvoyé par le serveur tout en haut de la liste
        setAvisClients([nouvelAvisEnregistre, ...avisClients]);
        
        // Réinitialisation du formulaire
        setNouveauNom("");
        setNouvelleNote(5);
        setNouveauCommentaire("");
        setAfficherFormulaire(false);
      } else {
        alert("Erreur lors de l'enregistrement de l'avis.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Impossible de contacter le serveur NestJS.");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fb",
        color: "#0f172a",
        overflowX: "hidden",
      }}
    >
      {/* HEADER / NAVIGATION */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px clamp(15px, 5vw, 60px)",
          background: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0, color: "#02152b", fontSize: "22px" }}>
          ACADEMY <span style={{ color: "#22c55e" }}>PRO</span>
        </h2>
        <div style={{ display: "flex", gap: "15px" }}>
          <button style={heroBtn2}>Contact</button>
          <button style={heroBtn}>Espace Client</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap-reverse",
          alignItems: "center",
          gap: "40px",
          padding: "clamp(20px, 5vw, 60px) clamp(15px, 5vw, 40px)",
        }}
      >
        <div style={{ flex: "1 1 450px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 60px)",
              marginBottom: "20px",
              lineHeight: "1.2",
            }}
          >
            BIENVENUE CHEZ <br />
            <span style={{ color: "#22c55e" }}> ACADEMY PRO</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#475569",
              marginBottom: "30px",
            }}
          >
            Votre partenaire pour tous vos besoins numériques.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={heroBtn}>Découvrir nos services</button>
            <button style={heroBtn2}>Voir les ordinateurs</button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "40px",
              flexWrap: "wrap",
            }}
          >
            <Badge text="Rapide & Fiable" />
            <Badge text="Sécurisé" />
            <Badge text="Disponible 24/7" />
            <Badge text="Support réactif" />
          </div>
        </div>

        <div style={{ flex: "1 1 400px", textAlign: "center" }}>
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
            alt="ordinateur"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "550px",
              borderRadius: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section style={{ padding: "40px clamp(15px, 5vw, 60px)" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(26px, 4vw, 40px)",
            marginBottom: "30px",
          }}
        >
          Nos Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {services.map((service, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ fontSize: "40px" }}>{service.icon}</div>
              <h3 style={{ marginTop: "15px", fontSize: "20px" }}>{service.title}</h3>
              <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.5", margin: "10px 0 20px" }}>
                {service.desc}
              </p>
              <button style={smallBtn}>En savoir plus</button>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS SECTION */}
      <section style={{ padding: "40px clamp(15px, 5vw, 60px)" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(26px, 4vw, 40px)",
            marginBottom: "40px",
          }}
        >
          Nos ordinateurs en vedette
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "25px",
          }}
        >
          {products.map((product, index) => (
            <div key={index} style={productCard}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
              <h3 style={{ marginTop: "15px", fontSize: "18px" }}>{product.name}</h3>
              <p
                style={{
                  color: "#22c55e",
                  fontWeight: "bold",
                  fontSize: "18px",
                  margin: "10px 0",
                }}
              >
                {product.price}
              </p>
              <button style={{ ...heroBtn, width: "100%", padding: "12px" }}>Acheter</button>
            </div>
          ))}
        </div>
      </section>

      {/* AVIS CLIENTS DYNAMIQUES */}
      <section
        style={{
          padding: "60px clamp(15px,5vw,60px)",
          background: "#ffffff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "38px",
            marginBottom: "10px",
            color: "#02152b",
          }}
        >
          ⭐ Ce que pensent nos clients
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "40px",
            fontSize: "18px",
          }}
        >
          Plus de <strong>5 000 clients</strong> nous font confiance.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "25px",
          }}
        >
          {avisClients.map((avis, index) => (
            <div
              key={avis.id || index}
              style={{
                background: "#f8fafc",
                padding: "25px",
                borderRadius: "18px",
                boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                borderLeft: "6px solid #22c55e",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{avis.nom}</h3>
                  <small style={{ color: "#94a3b8" }}>
                    {avis.createdAt ? new Date(avis.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : avis.date}
                  </small>
                </div>
                <span style={{ color: "#f59e0b", fontSize: "22px" }}>
                  {"★".repeat(avis.note)}
                </span>
              </div>
              <p style={{ color: "#475569", lineHeight: "1.7" }}>
                "{avis.commentaire}"
              </p>

              {/* Affichage de la réponse admin si elle existe */}
              {avis.reponseAdmin && (
                <div style={{ marginTop: "15px", padding: "10px", background: "#e2e8f0", borderRadius: "8px", fontSize: "13px" }}>
                  <strong>Réponse d'Academy Pro :</strong> {avis.reponseAdmin}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bouton pour afficher/masquer le formulaire */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => setAfficherFormulaire(!afficherFormulaire)}
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              padding: "15px 35px",
              borderRadius: "12px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {afficherFormulaire ? "Fermer le formulaire" : "Laisser un avis"}
          </button>
        </div>

        {/* Formulaire dynamique d'ajout d'avis */}
        {afficherFormulaire && (
          <form
            onSubmit={ajouterAvis}
            style={{
              maxWidth: "600px",
              margin: "30px auto 0",
              background: "#f8fafc",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h3 style={{ margin: 0, textAlign: "center", color: "#02152b" }}>Partagez votre expérience</h3>
            
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Votre Nom :</label>
              <input
                type="text"
                value={nouveauNom}
                onChange={(e) => setNouveauNom(e.target.value)}
                placeholder="Ex: Kouassi Marie"
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Note (1 à 5 étoiles) :</label>
              <select
                value={nouvelleNote}
                onChange={(e) => setNouvelleNote(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              >
                <option value="5">★★★★★ (5/5)</option>
                <option value="4">★★★★☆ (4/5)</option>
                <option value="3">★★★☆☆ (3/5)</option>
                <option value="2">★★☆☆☆ (2/5)</option>
                <option value="1">★☆☆☆☆ (1/5)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Votre Commentaire :</label>
              <textarea
                value={nouveauCommentaire}
                onChange={(e) => setNouveauCommentaire(e.target.value)}
                placeholder="Qu'avez-vous pensé de nos services ?"
                rows="4"
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: "#02152b",
                color: "white",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Publier mon avis
            </button>
          </form>
        )}
      </section>

      {/* STATS SECTION */}
      <section
        style={{
          background: "#02152b",
          color: "white",
          padding: "60px clamp(15px, 5vw, 60px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "40px 20px",
            textAlign: "center",
          }}
        >
          <Stat value="+5000" label="Clients satisfaits" />
          <Stat value="+12000" label="Documents traités" />
          <Stat value="+800" label="Apprenants formés" />
          <Stat value="+300" label="Ordinateurs vendus" />
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#010e1c",
          color: "#94a3b8",
          padding: "40px clamp(15px, 5vw, 60px)",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: "0 0 10px", color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}>
          Academy Pro - Votre solution numérique au quotidien
        </p>
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} Academy Pro. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

/* COMPONENTS */

function Badge({ text }) {
  return (
    <div
      style={{
        background: "white",
        padding: "8px 16px",
        borderRadius: "10px",
        fontSize: "14px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        fontWeight: "500",
      }}
    >
      {text}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <h2 style={{ fontSize: "clamp(30px, 4vw, 42px)", color: "#22c55e", margin: "0 0 5px" }}>{value}</h2>
      <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>{label}</p>
    </div>
  );
}

/* STYLES INTERNES */

const heroBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const heroBtn2 = {
  background: "white",
  color: "#02152b",
  border: "1px solid #cbd5e1",
  padding: "12px 22px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const productCard = {
  background: "white",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
};

const smallBtn = {
  marginTop: "auto",
  background: "#22c55e",
  border: "none",
  color: "white",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "500",
  width: "fit-content",
};