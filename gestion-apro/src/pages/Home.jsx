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
      image:
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    },
    {
      name: "Dell Latitude 5490",
      price: "230 000 FCFA",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
    {
      name: "Lenovo ThinkPad X1",
      price: "420 000 FCFA",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      name: "HP ProBook 450",
      price: "220 000 FCFA",
      image:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fb",
        color: "#0f172a",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: "40px",
          padding: "10px 10px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "65px",
              marginBottom: "20px",
              lineHeight: "1.1",
            }}
          >
            BIENVENUE CHEZ <br />
            <span style={{ color: "#22c55e" }}> ACADEMY PRO</span>
          </h1>

          <p
            style={{
              fontSize: "20px",
              color: "#475569",
              marginBottom: "30px",
            }}
          >
            Votre partenaire pour tous vos besoins numériques.
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={heroBtn}>Découvrir nos services</button>

            <button style={heroBtn2}>Voir les ordinateurs</button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
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

        <div style={{ textAlign: "center" }}>
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
            alt="ordinateur"
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "25px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "4x 60px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "40px",
            marginBottom: "5px",
          }}
        >
          Nos Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          {services.map((service, index) => (
            <div key={index} style={cardStyle}>
              <div style={{ fontSize: "50px" }}>{service.icon}</div>

              <h3 style={{ marginTop: "20px" }}>{service.title}</h3>

              <p style={{ color: "#64748b" }}>{service.desc}</p>

              <button style={smallBtn}>En savoir plus</button>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUITS */}
      <section style={{ padding: "40px 60px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "40px",
            marginBottom: "50px",
          }}
        >
          Nos ordinateurs en vedette
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
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

              <h3 style={{ marginTop: "20px" }}>{product.name}</h3>

              <p
                style={{
                  color: "#22c55e",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {product.price}
              </p>

              <button style={heroBtn}>Acheter</button>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          background: "#02152b",
          color: "white",
          padding: "60px",
          marginTop: "50px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "30px",
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
        padding: "12px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
    >
      {text}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <h2 style={{ fontSize: "40px", color: "#22c55e" }}>{value}</h2>
      <p>{label}</p>
    </div>
  );
}

/* STYLES */

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};

const loginBtn = {
  background: "transparent",
  border: "1px solid white",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
};

const registerBtn = {
  background: "#22c55e",
  border: "none",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  cursor: "pointer",
};

const heroBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "15px 25px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const heroBtn2 = {
  background: "white",
  color: "#02152b",
  border: "1px solid #cbd5e1",
  padding: "15px 25px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
};

const productCard = {
  background: "white",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
};

const smallBtn = {
  marginTop: "15px",
  background: "#22c55e",
  border: "none",
  color: "white",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
};