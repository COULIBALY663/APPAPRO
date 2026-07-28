import React from "react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg border-0 text-center p-5"
        style={{ maxWidth: "650px", borderRadius: "20px" }}
      >
        <div style={{ fontSize: "70px" }}>❌</div>

        <h2 className="text-danger fw-bold mt-3">
          Paiement annulé
        </h2>

        <p className="fs-5 mt-3 text-secondary">
          Votre paiement n'a pas été effectué ou a été annulé.
          <br />
          Vous pouvez réessayer à tout moment.
        </p>

        <div
          className="alert alert-warning mt-4"
          style={{ fontSize: "18px" }}
        >
          <strong>ACADEMY PRO</strong> vous remercie de votre visite et reste à votre disposition.
        </div>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <Link to="/" className="btn btn-secondary btn-lg">
            Retour à l'accueil
          </Link>

          <button
            className="btn btn-success btn-lg"
            onClick={() => window.history.back()}
          >
            Réessayer le paiement
          </button>
        </div>
      </div>
    </div>
  );
}