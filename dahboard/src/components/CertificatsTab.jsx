import React from "react";
import { renderFile } from "../utils/fileUtils";

export default function CertificatsTab({ certificats, paiements, onValiderDossier, onDeleteCertificat, getPaymentBadgeStyle, translatePaymentStatus }) {
  return (
    <div>
      <h2 style={{ fontSize: "50px", textAlign: "center", backgroundColor: "orange", fontWeight: "bold", color: 'white', padding: "8px 12px", borderRadius: "4px" }}>
        📄 Gestion des Certificats
      </h2>
      <p style={{ fontWeight: "bold", color: "#555" }}>Total: {certificats?.length || 0}</p>
      
      <div style={{ overflowX: "auto", width: "100%" }}>
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th>IDENTIFIANT</th>
              <th>Noms et Prénoms</th>
              <th>Contact (Formulaire)</th>
              <th>Situation Matrimoniale</th>
              <th>Nom du Conjoint</th>
              <th>Extrait</th>
              <th>Recto Parent</th>
              <th>Verso Parent</th>
              <th>Recto Pièce</th>
              <th>Verso Pièce</th>
              <th>Acte</th>
              <th>Dossier statutaire</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificats.map((c) => {
              const id = c.id || c.IDENTIFIANT;

              // 🎯 Rapprochement par ID ultra-sécurisé
              const paiementLie = paiements.find((p) => {
                const pCertificatId = p.certificat_id || p.certificatId || p.certificatIdCertificat;
                const idDepuisObjet = p.certificat && typeof p.certificat === 'object' ? (p.certificat.id || p.certificat.IDENTIFIANT) : null;
                const finalPaiementId = pCertificatId || idDepuisObjet;

                if (finalPaiementId && id) {
                  return String(finalPaiementId).trim() === String(id).trim();
                }
                if (!finalPaiementId && c.telephone && p.telephone) {
                  return String(c.telephone).trim() === String(p.telephone).trim();
                }
                return false;
              });
              
              const statutPaiementReel = paiementLie ? paiementLie.statut : "";
              const normalizedStatus = String(statutPaiementReel).toLowerCase().trim();
              const estPayé = normalizedStatus === "paid" || normalizedStatus === "success" || normalizedStatus === "completed";
              
              return (
                <React.Fragment key={id}>
                  <tr style={{ backgroundColor: "#ffffff" }}>
                    <td><b>#{id}</b></td>
                    <td>
                      <strong>{String(c.nom || c.Nom || "").toUpperCase()}</strong><br />
                      {c.prenom || c.Prénom || ""}
                    </td>
                    <td>
                      📱 {c.telephone || c.Téléphone || "N/A"}<br />
                      <span style={{ fontSize: "11px", color: "#777" }}>{c.email || "Non disponible"}</span>
                    </td>
                    
                    {/* 🆕 Situation Matrimoniale (Laissée vide si pas de donnée) */}
                    <td style={{ textAlign: "center" }}>
                      {c.situationmatrimoniale && (
                        <span style={{ backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 8px", borderRadius: "4px", fontWeight: "500" }}>
                          {c.situationmatrimoniale}
                        </span>
                      )}
                    </td>

                    {/* 🆕 Nom du Conjoint (Laissé vide si pas de donnée) */}
                    <td style={{ textAlign: "center", color: "#334155" }}>
                      {c.nomconjoint || ""}
                    </td>

                    <td style={{ textAlign: "center" }}>{renderFile(c.extrait)}</td>
                    <td style={{ textAlign: "center" }}>{renderFile(c.parent_recto)}</td>
                    <td style={{ textAlign: "center" }}>{renderFile(c.parent_verso)}</td>
                    <td style={{ textAlign: "center" }}>{renderFile(c.recto_piece)}</td>
                    <td style={{ textAlign: "center" }}>{renderFile(c.verso_piece)}</td>
                    <td style={{ textAlign: "center" }}>{renderFile(c.acte_individuel)}</td>
                    <td style={{ textAlign: "center" }}>
                      {c.statut === "Traité" ? (
                        <button onClick={() => onValiderDossier(id, c.statut)} style={{ background: "#198754", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>
                          ✅ Traité
                        </button>
                      ) : (
                        <button onClick={() => onValiderDossier(id, c.statut || "En attente")} style={{ background: estPayé ? "#0d6efd" : "#6c757d", color: "white", border: "none", padding: "6px 12px", cursor: estPayé ? "pointer" : "not-allowed", borderRadius: "4px", fontWeight: "bold" }} disabled={!estPayé}>
                          ⏳ En attente
                        </button>
                      )}
                    </td>
                    <td>
                      <button onClick={() => onDeleteCertificat(id)} style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>
                        Supprimer
                      </button>
                    </td>
                  </tr>

                  {/* Ligne jaune d'informations financières */}
                  <tr style={{ backgroundColor: "#fdf8e2" }}>
                    <td colSpan="13" style={{ padding: "8px 15px", borderTop: "none" }}>
                      {paiementLie ? (
                        <div style={{ display: "flex", gap: "25px", alignItems: "center", fontSize: "12px", color: "#6c4b00" }}>
                          <span><b>💳 INFOS PAIEMENT :</b></span>
                          <span><b>ID unique :</b> #{paiementLie.id}</span>
                          <span><b>Référence transaction :</b> <code>{paiementLie.transaction_id}</code></span>
                          <span><b>Téléphone :</b> {paiementLie.telephone}</span>
                          <span><b>Montant :</b> <b style={{ color: "#155724" }}>{paiementLie.montant} FCFA</b></span>
                          <span><b>Statut :</b> &nbsp;
                            <span style={getPaymentBadgeStyle(paiementLie.statut)}>
                              {translatePaymentStatus(paiementLie.statut)}
                            </span>
                          </span>
                          <span><b>Service :</b> <span style={{ textTransform: "uppercase", background: "#fff", padding: "2px 5px", borderRadius: "3px", border: "1px solid #e2d29b" }}>{paiementLie.type_service}</span></span>
                        </div>
                      ) : (
                        <div style={{ fontSize: "12px", color: "#6c757d", fontStyle: "italic" }}>
                          ❌ Aucun paiement PayDunya associé trouvé pour ce dossier.
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}