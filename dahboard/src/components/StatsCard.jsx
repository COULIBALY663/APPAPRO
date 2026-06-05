export default function StatsCard({ title, total }) {
  return (
    <div
      style={{
        background: "blue",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "200px",
      }}
    >
      <h3>{title}</h3>
      <h1>{total}</h1>
    </div>
  );
}