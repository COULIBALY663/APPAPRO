import React from "react"; 
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg border-0 text-center p-5"
        style={{ maxWidth: "650px", borderRadius: "20px" }}
      >
        <div style={{ fontSize: "70px" }}>🎉</div>

        <h2 className="text-success fw-bold mt-3">
          Félicitations !
        </h2>

        <p className="fs-5 mt-3 text-secondary">
          Votre demande est bien prise en compte.
          <br />
          Nous allons procéder à son traitement dans les meilleurs délais.
        </p>

        <div
          className="alert alert-success mt-4"
          style={{ fontSize: "18px" }}
        >
          <strong>ACADEMY PRO</strong> vous remercie pour votre confiance !
        </div>

        <Link to="/" className="btn btn-success btn-lg mt-3">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}