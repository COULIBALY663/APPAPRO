import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Documents from "../pages/Documents";
import CoursierForm from "../pages/Coursier"; // 👈 Assure-toi que ton fichier s'appelle exactement Coursier.jsx dans ton dossier pages !

import Marche from "../pages/Marche";

import EService from "../pages/EService";
import Certificat from "../pages/Certificat";
import Casier from "../pages/Casier";
import Timbre from "../pages/Timbre";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Contact from "../pages/Contact";

// 🔐 Routes privées
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* Pages publiques */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Pages privées */}
      <Route element={<MainLayout />}>

        <Route path="/documents" element={
          <PrivateRoute><Documents /></PrivateRoute>
        } />

        <Route path="/marche" element={
          <PrivateRoute><Marche /></PrivateRoute>
        } />

        {/* 🔥 TOUTES LES ROUTES EN MINUSCULES POUR COMPATIBILITÉ LINUX/RENDER */}
        <Route path="/eservice" element={
          <PrivateRoute><EService /></PrivateRoute>
        } />
          
        <Route path="/certificat" element={
          <PrivateRoute><Certificat /></PrivateRoute>
        } />

        <Route path="/contact" element={
          <PrivateRoute><Contact /></PrivateRoute>
        } />

        <Route path="/coursier" element={
          <PrivateRoute><CoursierForm /></PrivateRoute>
        } />

        <Route path="/casier" element={
          <PrivateRoute><Casier /></PrivateRoute>
        } />

        <Route path="/timbre" element={
          <PrivateRoute><Timbre /></PrivateRoute>
        } />

      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}