import React, { useState, useEffect } from "react";
// 1. Assure-toi d'importer tes fonctions d'API
import { fetchCertificats, deleteCertificat } from "../services/api"; // Ajuste le chemin du fichier
import CertificatsTable from "./CertificatsTable"; // Ton tableau

export default function AdminCertificats() {
  const [certificats, setCertificats] = useState([]);

  // Chargement initial des certificats
  useEffect(() => {
    fetchCertificats()
      .then((data) => setCertificats(data))
      .catch((err) => console.error("Erreur de chargement:", err));
  }, []);

  // 2. La fonction logique de suppression que le bouton va déclencher
  const handleDelete = async (id) => {
    try {
      // On lance la fonction de ton fichier d'API (qui fonctionne sur Postman)
      await deleteCertificat(id);
      
      // Si l'API NestJS répond avec succès, on retire la ligne de l'affichage React
      setCertificats(certificats.filter(c => (c.certificat_id || c.IDENTIFIANT) !== id));
      
      alert("Le certificat a été supprimé avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du dossier.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* 3. CRUCIAL : Tu passes la fonction "handleDelete" à la prop "onDelete" */}
      <CertificatsTable 
        certificats={certificats} 
        onDelete={handleDelete} 
      />
    </div>
  );
}