import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Documents from "../pages/Documents";
import Chat from "../pages/Chat";
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

        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />

        <Route path="/documents" element={
          <PrivateRoute><Documents /></PrivateRoute>
        } />

        <Route path="/chat" element={
          <PrivateRoute><Chat /></PrivateRoute>
        } />

        <Route path="/marche" element={
          <PrivateRoute><Marche /></PrivateRoute>
        } />

        {/* 🔥 NOUVELLES ROUTES */}
        <Route path="/eservice" element={
          <PrivateRoute><EService /></PrivateRoute>
        } />
         
        <Route path="/Certificat" element={
          <PrivateRoute><Certificat /></PrivateRoute>
        } />
        <Route path="/Contact" element={
          <PrivateRoute><Contact /></PrivateRoute>
        } />

        <Route path="/Casier" element={
          <PrivateRoute><Casier /></PrivateRoute>
        } />

        <Route path="/Timbre" element={
          <PrivateRoute><Timbre /></PrivateRoute>
        } />

      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}