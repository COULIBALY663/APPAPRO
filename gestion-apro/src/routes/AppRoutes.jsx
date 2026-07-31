import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages Publiques
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Contact from "../pages/Contact";
import Propos from "../pages/Propos";

// Pages Privées
import Documents from "../pages/Documents";
import CoursierForm from "../pages/Coursier";
import Marche from "../pages/Marche";
import EService from "../pages/EService";
import Certificat from "../pages/Certificat";
import Casier from "../pages/Casier";
import Rapport from "../pages/Rapport";
import Timbre from  "../pages/Timbre";


// 🔐 Composant pour sécuriser plusieurs routes à la fois
function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌐 PAGES PUBLIQUES (Layout Principal) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/propos" element={<Propos />} />
      </Route>

      {/* 🗝️ AUTHENTIFICATION (Layout Auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔒 PAGES PRIVÉES (Protégées par PrivateRoute) */}
      <Route element={<PrivateRoute />}>
        {/* Enveloppées dans MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/documents" element={<Documents />} />
          <Route path="/marche" element={<Marche />} />
          <Route path="/eservice" element={<EService />} />
          <Route path="/certificat" element={<Certificat />} />
          <Route path="/coursier" element={<CoursierForm />} />
          <Route path="/casier" element={<Casier />} />
          <Route path= "/Timbre" element={<Timbre />}/>
        </Route>

        {/* Route privée HORS du MainLayout (pleine page) */}
        <Route path="/rapport" element={<Rapport />} />
      </Route>

      {/* ❓ Redirection 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}