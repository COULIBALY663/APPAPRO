export default function Sidebar({
  activeTab,
  setActiveTab,
}) {
  return (
    <div
      style={{
        width: "220px",
        background: "#111",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "white" }}>
        📊 Admin
      </h2>

      <button
        onClick={() => setActiveTab("users")}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "20px",
          background:
            activeTab === "users"
              ? "blue"
              : "transparent",
          color: "white",
          border: "1px solid white",
          cursor: "pointer",
        }}
      >
        👥 UTILISATEURS
      </button>

      <button
        onClick={() => setActiveTab("certificats")}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          background:
            activeTab === "certificats"
              ? "blue"
              : "transparent",
          color: "white",
          border: "1px solid white",
          cursor: "pointer",
        }}
      >
        📄 DOCUMENTS A TRAITES
      </button>
    </div>
  );
}