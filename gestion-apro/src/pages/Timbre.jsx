import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Timbre() {
  const navigate = useNavigate();

  // Gestion des étapes : "form" | "waiting_payment" | "success"
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [createdData, setCreatedData] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    typeDemande: "", // Stockera : 'timbre:nouvelle', 'timbre:duplicata' ou 'timbre:renouvellement'
    nomConjoint: "", 
    situationMatrimoniale: "Célibataire" // 🔥 Ajout de la valeur par défaut
  });

  const [files, setFiles] = useState({
    extrait: null,
    recto_piece: null, 
    verso_piece: null, 
  });

  const [preview, setPreview] = useState({
    extrait: null,
    recto_piece: null,
    verso_piece: null,
  });

  // ======================
  // HANDLE INPUT TEXT & AUTOMATION
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };

      // 🔥 LOGIQUE AUTOMATIQUE : Si le nom du conjoint est saisi, marié(e), sinon célibataire
      if (name === "nomConjoint") {
        updatedForm.situationMatrimoniale = value.trim() !== "" ? "Marié(e)" : "Célibataire";
      }

      return updatedForm;
    });
  };

  // 💡 GESTION DU CHOIX DES 3 BOUTONS AVEC LE PREFIXE "timbre:"
  const handleTypeSelect = (type) => {
    setForm({ ...form, typeDemande: `timbre:${type}` });
  };

  // ======================
  // HANDLE FILES WITH PREVIEW
  // ======================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    
    setFiles((prev) => ({ ...prev, [name]: file }));
    
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreview((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ======================
  // ETAPE 1 : SUBMIT FORMULAIRE (Enregistrement dans la table certificat)
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.typeDemande) {
      alert("⚠️ Veuillez choisir un type de démarche avant de soumettre !");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("prenom", form.prenom);
      formData.append("telephone", form.telephone);
      formData.append("typeDemande", form.typeDemande);
      
      // 🔥 ENVOI SÉCURISÉ DU STATUT AUTOMATIQUE (Casse préservée pour l'API)
      formData.append("situationMatrimoniale", form.situationMatrimoniale);
      formData.append("situationmatrimoniale", form.situationMatrimoniale); 
      
      if (isExtraFieldsRequired && form.nomConjoint) {
        formData.append("nomConjoint", form.nomConjoint);
      }

      // Tout est enregistré dans la table certificat d'après ta logique métier backend
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      const res = await fetch("https://appapro.onrender.com/certificat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de la création de la demande de timbre");

      const data = await res.json();
      setCreatedData(data);
      setStep("waiting_payment");
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de l'envoi du dossier");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // ETAPE 2 : ACTION DE PAIEMENT PAYDUNYA
  // ======================
  const handlePayNow = async () => {
    const certificatId = createdData?.id || createdData?.IDENTIFIANT || createdData?.id_certificat;

    if (!certificatId) {
      alert("❌ Erreur : Impossible de récupérer l'identifiant de la demande générée.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://appapro.onrender.com/paiement/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telephone: form.telephone,
          montant: 200, 
          type_service: form.typeDemande, 
          certificat_id: Number(certificatId),
        }),
      });

      if (!res.ok) throw new Error("Erreur initialisation paiement");
      
      const paymentData = await res.json();

      if (paymentData?.payment_url) {
        localStorage.setItem("pending_timbre_payment_success", "true");
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error("L'URL de paiement n'a pas été générée");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Impossible de joindre le service de paiement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isSuccess = localStorage.getItem("pending_timbre_payment_success");
    if (isSuccess === "true") {
      localStorage.removeItem("pending_timbre_payment_success");
      setStep("success");
    }
  }, []);

  // Vérificateurs dynamiques basés sur la sélection
  const isExtraFieldsRequired = form.typeDemande === "timbre:duplicata" || form.typeDemande === "timbre:renouvellement";

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px 15px", fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        .type-btn { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .type-btn:hover { transform: translateY(-2px); }
        .input-field:focus { border-color: #22c55e !important; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1) !important; outline: none; }
        .btn-action { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .btn-action:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={containerStyle}>
        
        {/* EN-TÊTE DU COMPOSANT */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em" }}>
            📋 DEMANDE DE TIMBRE
          </h2>
        </div>

        {/* RENDU 1 : ÉCRAN DE SUCCÈS FINAL */}
        {step === "success" && (
          <div className="fade-in" style={{ padding: "40px 30px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ color: "#16a34a", fontWeight: "800", margin: "0 0 12px" }}>Félicitations !</h2>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.6", margin: "0 0 24px" }}>
              Votre demande de timbre a bien été prise en compte. Nous allons procéder au traitement dans les plus brefs délais.
            </p>
            <div style={{ background: "#f0fdf4", padding: "16px", borderRadius: "12px", border: "1px solid #bbf7d0", fontWeight: "700", color: "#16a34a", marginBottom: "32px" }}>
              ACADEMY PRO vous remercie pour votre confiance !
            </div>
            <button className="btn-action" style={primaryButtonStyle} onClick={() => navigate("/dashboard")}>
              Aller au Dashboard
            </button>
          </div>
        )}

        {/* RENDU 2 : MESSAGE DE TRANSITION */}
        {step === "waiting_payment" && (
          <div className="fade-in" style={{ padding: "40px 30px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📩</div>
            <h2 style={{ color: "#f97316", fontWeight: "800", margin: "0 0 12px" }}>Informations reçues !</h2>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.6", margin: "0 0 32px" }}>
              Merci d'avoir envoyé vos documents. Veuillez maintenant procéder au paiement sécurisé pour valider définitivement votre demande.
            </p>
            <button className="btn-action" style={payButtonStyle} onClick={handlePayNow} disabled={loading}>
              {loading ? "⏳ Redirection vers PayDunya..." : "💳 Payer maintenant (2 00 FCFA)"}
            </button>
          </div>
        )}

        {/* RENDU 3 : LE FORMULAIRE INITIAL */}
        {step === "form" && (
          <div style={{ padding: "30px clamp(15px, 5vw, 40px)" }}>
            
            {/* SÉLECTEUR DE TYPE */}
            <label style={labelStyle}>Quel type de démarche effectuez-vous ? <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={gridButtonsStyle}>
              <button type="button" className="type-btn" onClick={() => handleTypeSelect("nouvelle")} style={optionButtonStyle(form.typeDemande === "timbre:nouvelle")}>
                <span style={{ fontSize: "24px", marginBottom: "6px" }}>✨</span>
                <span style={{ fontWeight: "700" }}>Nouvelle demande</span>
              </button>

              <button type="button" className="type-btn" onClick={() => handleTypeSelect("duplicata")} style={optionButtonStyle(form.typeDemande === "timbre:duplicata")}>
                <span style={{ fontSize: "24px", marginBottom: "6px" }}>📄</span>
                <span style={{ fontWeight: "700" }}>Demande de duplicata</span>
              </button>

              <button type="button" className="type-btn" onClick={() => handleTypeSelect("renouvellement")} style={optionButtonStyle(form.typeDemande === "timbre:renouvellement")}>
                <span style={{ fontSize: "24px", marginBottom: "6px" }}>🔄</span>
                <span style={{ fontWeight: "700" }}>Renouvellement</span>
              </button>
            </div>

            {form.typeDemande ? (
              <form onSubmit={handleSubmit} className="fade-in">
                
                {/* COORDONNÉES */}
                <label style={labelStyle}>Informations personnelles</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <input type="text" name="nom" placeholder="Nom" className="input-field" style={inputStyle} value={form.nom} required onChange={handleChange} />
                  <input type="text" name="prenom" placeholder="Prénom" className="input-field" style={inputStyle} value={form.prenom} required onChange={handleChange} />
                </div>
                <input type="tel" name="telephone" placeholder="Téléphone" className="input-field" style={inputStyle} value={form.telephone} required onChange={handleChange} />

                {/* CHAMP NOM DU CONJOINT */}
                {isExtraFieldsRequired && (
                  <div className="fade-in" style={{ marginTop: "8px" }}>
                    <label style={labelStyle}>Situation matrimoniale (Optionnel)</label>
                    <input
                      type="text"
                      name="nomConjoint"
                      placeholder="Nom du conjoint (si marié·e)"
                      className="input-field"
                      style={inputStyle}
                      value={form.nomConjoint}
                      onChange={handleChange}
                    />
                  </div>
                )}

                {/* DOCUMENTS REQUIS */}
                <div style={sectionDividerStyle(false)}>
                  <span>📄 Documents obligatoires</span>
                </div>

                {/* Extrait */}
                <div style={fileUploadBox}>
                  <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>
                    Extrait de naissance <span style={{ color: "#ef4444" }}>*</span>
                  </p>
                  <input type="file" name="extrait" accept=".pdf,.jpg,.jpeg,.png" required onChange={handleFileChange} style={{ fontSize: "14px" }} />
                  {preview.extrait && (
                    <div style={previewContainerStyle}><img src={preview.extrait} alt="Aperçu Extrait" style={imgStyle} /></div>
                  )}
                </div>

                {/* Pièces Recto / Verso */}
                {isExtraFieldsRequired && (
                  <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "16px" }}>
                    <div style={fileUploadBox}>
                      <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>
                        🪪 Pièce d'identité (RECTO) <span style={{ color: "#ef4444" }}>*</span>
                      </p>
                      <input type="file" name="recto_piece" accept=".pdf,.jpg,.jpeg,.png" required onChange={handleFileChange} style={{ fontSize: "14px" }} />
                      {preview.recto_piece && (
                        <div style={previewContainerStyle}><img src={preview.recto_piece} alt="Aperçu Recto" style={imgStyle} /></div>
                      )}
                    </div>

                    <div style={fileUploadBox}>
                      <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#1e293b", fontWeight: "700" }}>
                        🪪 Pièce d'identité (VERSO) <span style={{ color: "#ef4444" }}>*</span>
                      </p>
                      <input type="file" name="verso_piece" accept=".pdf,.jpg,.jpeg,.png" required onChange={handleFileChange} style={{ fontSize: "14px" }} />
                      {preview.verso_piece && (
                        <div style={previewContainerStyle}><img src={preview.verso_piece} alt="Aperçu Verso" style={imgStyle} /></div>
                      )}
                    </div>
                  </div>
                )}

                {/* ACTION DE SOUMISSION FORMULAIRE */}
                <button type="submit" className="btn-action" style={{ ...primaryButtonStyle, marginTop: "32px" }} disabled={loading}>
                  {loading ? "⏳ Envoi du dossier..." : "Envoyer la demande"}
                </button>

              </form>
            ) : (
              <div style={infoPlaceholderStyle}>
                💡 Veuillez sélectionner une option ci-dessus pour afficher votre formulaire de demande de timbre.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 🎨 STYLE DESIGN PREMIUM UNIFORMISÉ
// =========================================================================
const containerStyle = { backgroundColor: "#ffffff", maxWidth: "680px", margin: "0 auto", borderRadius: "24px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", overflow: "hidden" };
const headerStyle = { background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", color: "white", padding: "24px", textAlign: "center" };
const labelStyle = { display: "block", fontSize: "15px", fontWeight: "700", color: "#334155", marginBottom: "12px" };
const gridButtonsStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "28px" };

const optionButtonStyle = (isSelected) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px 10px",
  borderRadius: "16px",
  cursor: "pointer",
  fontSize: "14px",
  border: isSelected ? "2px solid #22c55e" : "2px solid #e2e8f0",
  background: isSelected ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#ffffff",
  color: isSelected ? "#ffffff" : "#475569",
  boxShadow: isSelected ? "0 8px 16px rgba(34, 197, 94, 0.2)" : "none",
});

const inputStyle = { width: "100%", padding: "14px 16px", marginBottom: "16px", border: "1px solid #cbd5e1", borderRadius: "12px", fontSize: "15px", boxSizing: "border-box" };
const sectionDividerStyle = (isOptional) => ({ background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#14532d", padding: "10px 16px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", textAlign: "center", margin: "24px 0 16px 0" });
const fileUploadBox = { background: "#f1f5f9", padding: "16px", borderRadius: "16px", border: "2px dashed #cbd5e1" };
const previewContainerStyle = { marginTop: "12px", display: "flex", justifyContent: "flex-start" };
const imgStyle = { maxWidth: "120px", maxHeight: "80px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0" };
const primaryButtonStyle = { width: "100%", padding: "16px", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "#fff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.2)" };
const payButtonStyle = { ...primaryButtonStyle, background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", boxShadow: "0 10px 15px -3px rgba(234, 88, 12, 0.2)" };
const infoPlaceholderStyle = { textAlign: "center", color: "#64748b", fontSize: "15px", padding: "40px 20px", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1", marginTop: "10px" };