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

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fb",
        color: "#0f172a",
        overflowX: "hidden", // Évite les barres de défilement horizontales bizarres sur mobile
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap-reverse", // Sur mobile, l'image passe au-dessus du texte naturellement
          alignItems: "center",
          gap: "40px",
          padding: "clamp(20px, 5vw, 60px) clamp(15px, 5vw, 40px)", // Padding dynamique intelligent
        }}
      >
        {/* Texte du Hero */}
        <div style={{ flex: "1 1 450px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 60px)", // S'adapte de 32px (mobile) à 60px (PC) sans déborder
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

          {/* Boutons d'action responsives */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={heroBtn}>Découvrir nos services</button>
            <button style={heroBtn2}>Voir les ordinateurs</button>
          </div>

          {/* Badges badges fluides */}
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

        {/* Image du Hero */}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", // Aligne proprement 1, 2 ou 3 colonnes selon l'écran
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

      {/* STATS SECTION */}
      <section
        style={{
          background: "#02152b",
          color: "white",
          padding: "60px clamp(15px, 5vw, 60px)",
          marginTop: "50px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", // Grille ultra flexible pour mobile
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
  justifyContent: "space-between", // Aligne proprement les boutons en bas des cartes
};

const productCard = {
  background: "white",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
};

const smallBtn = {
  marginTop: "auto", // Pousse le bouton vers le bas
  background: "#22c55e",
  border: "none",
  color: "white",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "500",
  width: "fit-content",
};