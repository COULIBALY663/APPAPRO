import React from "react";

export default function PaiementsTab({ paiements, getPaymentBadgeStyle, translatePaymentStatus }) {
  return (
    <div>
      <h2 style={{ backgroundColor: "#0d47a1", fontWeight: "bold", color: 'white', padding: "8px 12px", borderRadius: "4px" }}>
        💳 Historique des Transactions (PayDunya)
      </h2>
      <p style={{ fontWeight: "bold", color: "#555" }}>Nombre de transactions : {paiements?.length || 0}</p>
      
      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", fontSize: "14px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f3f5", textAlign: "left" }}>
            <th>ID Paiement</th>
            <th>Dossier Lié</th>
            <th>ID Transaction</th>
            <th>Téléphone Client</th>
            <th>Montant</th>
            <th>Service</th>
            <th style={{ textAlign: "center" }}>Statut PayDunya</th>
            <th>Date Création</th>
            <th>Justificatif / Lien</th>
          </tr>
        </thead>
        <tbody>
          {paiements.map((p) => {
            let receiptUrl = null;
            try {
              if (p.invoice_data) {
                const parsed = typeof p.invoice_data === 'string' ? JSON.parse(p.invoice_data) : p.invoice_data;
                receiptUrl = parsed?.data?.receipt_url || parsed?.receipt_url || null;
              }
            } catch (e) {
              console.error("Erreur de parsing de invoice_data", e);
            }

            return (
              <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td><b>#{p.id}</b></td>
                <td>
                  <span style={{ padding: "4px 8px", borderRadius: "4px", fontWeight: "bold", backgroundColor: "#e3f2fd", color: "#0d47a1" }}>
                    📄 Certificat #{p.certificat_id || "N/A"}
                  </span>
                </td>
                <td><code>{p.transaction_id || "N/A"}</code></td>
                <td>📱 {p.telephone || "N/A"}</td>
                <td><b style={{ color: "#155724", fontSize: "15px" }}>{p.montant || 0} FCFA</b></td>
                <td><span style={{ fontSize: "11px", textTransform: "uppercase", background: "#eee", padding: "3px 6px", borderRadius: "4px", fontWeight: "500" }}>{p.type_service || "Certificat"}</span></td>
                <td style={{ textAlign: "center" }}>
                  <span style={getPaymentBadgeStyle(p.statut)}>
                    {translatePaymentStatus(p.statut)}
                  </span>
                </td>
                <td style={{ fontSize: "12px", color: "#666" }}>
                  {p.created_at ? new Date(p.created_at).toLocaleString('fr-FR') : "N/A"}
                </td>
                <td>
                  {receiptUrl ? (
                    <a href={receiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0d6efd", fontWeight: "bold", textDecoration: "underline" }}>
                      📄 Télécharger Reçu
                    </a>
                  ) : p.payment_url ? (
                    <a href={p.payment_url} target="_blank" rel="noopener noreferrer" style={{ color: "#6c757d", fontSize: "12px" }}>
                      Lien Facture 🔗
                    </a>
                  ) : (
                    <span style={{ color: "#bbb", fontStyle: "italic" }}>Aucun lien</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}