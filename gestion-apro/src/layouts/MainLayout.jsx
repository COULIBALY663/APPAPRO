import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div>
      <Navbar />

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>

      <footer style={{
        textAlign: "left",
        padding: "5px",
        background: "#f0f9f0",
        marginTop: "10px",
        color: "black",
        marginLeft: "100px"
      }}>
        
      </footer>
    </div>
  );
}
