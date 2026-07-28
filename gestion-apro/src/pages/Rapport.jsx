import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Rapport() {
  const navigate = useNavigate();

  // Gestion des étapes : "form" | "waiting_payment" | "success"
  const [step, setStep] = useState("form"); 
  const [loading, setLoading] = useState(false);
  const [createdData, setCreatedData] = useState(null);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
  
  });

  const [files, setFiles] = useState({
    extrait: null,
   
  });

  const [preview, setPreview] = useState({
    extrait: null,
  });

  // ======================
  // HANDLE INPUT TEXT & SELECT
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
  // ETAPE 1 : SUBMIT FORMULAIRE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("prenom", form.prenom);
      formData.append("telephone", form.telephone);
      

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });

      const res = await fetch("https://appapro.onrender.com/certificat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur création de demande de mise forme");

      const data = await res.json();
      console.log("CASIER JUDICIAIRE CREATED:", data);
      
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
  // ETAPE 2 : ACTION DE PAIEMENT
  // ======================
  const handlePayNow = async () => {
    const certificatId = createdData?.id || createdData?.IDENTIFIANT || createdData?.id_certificat;

    if (!certificatId) {
      alert("❌ Erreur : Impossible de récupérer l'identifiant du casier judiciaire créé.");
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
          type_service: "Rapport de stage",
          certificat_id: Number(certificatId)
        }),
      });

      if (!res.ok) throw new Error("Erreur initialisation paiement");
      
      const paymentData = await res.json();

      if (paymentData?.payment_url) {
        localStorage.setItem("pending_payment_success", "true");
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
    const isSuccess = localStorage.getItem("pending_payment_success");
    if (isSuccess === "true") {
      localStorage.removeItem("pending_payment_success");
      setStep("success");
    }
  }, []);

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh", padding: "40px 15px", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .input-field:focus { border-color: #22c55e !important; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1) !important; outline: none; }
        .btn-action { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .btn-action:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={containerStyle}>
        
        {/* EN-TÊTE PREMIUM */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "800", textTransform: "uppercase" }}>
            📄 Demande de mise en forme de rapport de stage
          </h2>
        </div>

        {/* ÉCRAN D'ATTENTE DE PAIEMENT */}
        {step === "waiting_payment" && (
          <div className="fade-in" style={{ padding: "40px 30px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📩</div>
            <h2 style={{ color: "#ea580c", fontWeight: "800", margin: "0 0 12px" }}>Informations reçues !</h2>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.6", margin: "0 0 32px" }}>
              Merci d'avoir envoyé vos informations. Veuillez maintenant procéder au paiement sécurisé pour finaliser votre demande.
            </p>
            <button className="btn-action" style={payButtonStyle} onClick={handlePayNow} disabled={loading}>
              {loading ? "⏳ Redirection vers PayDunya..." : "💳 Payer maintenant"}
            </button>
          </div>
        )}

        {/* FORMULAIRE PRINCIPAL */}
        {step === "form" && (
          <div style={{ padding: "30px" }}>
            <form onSubmit={handleSubmit}>
              
              <div style={sectionTitle}>👤 Informations Personnelles</div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input name="nom" placeholder="Nom" className="input-field" style={inputStyle} required onChange={handleChange} />
                <input name="prenom" placeholder="Prénom" className="input-field" style={inputStyle} required onChange={handleChange} />
              </div>
              
              <input name="telephone" type="tel" placeholder="Téléphone(whatsapp)" className="input-field" style={inputStyle} required onChange={handleChange} />

             
              {/* DOCUMENTS OBLIGATOIRES */}
              <div style={sectionDividerGreen}>📄 Documents obligatoires</div>
              
              <div style={fileBox}>
                <p style={fileLabel}>DEPOSER VOTRE RAPPORT DE STAGE (Word ou PDF) ICI <span style={{ color: "#ef4444" }}>*</span></p>
                <input type="file" name="extrait" accept=".pdf,.doc,.docx"  required onChange={handleFileChange} style={{ fontSize: "14px" }} />
                {preview.extrait && (
                  <div style={previewContainerStyle}><img src={preview.extrait} style={thumbStyle} alt="Aperçu Extrait" /></div>
                )}
              </div>

              <button type="submit" className="btn-action" style={{ ...primaryButtonStyle, marginTop: "35px" }} disabled={loading}>
                {loading ? "⏳ Envoi des documents..." : "Envoyer la demande"}
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles de l'interface
const containerStyle = { background: "#ffffff", maxWidth: "690px", margin: "0 auto", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" };
const headerStyle = { background: "#ea580c", color: "#ffffff", padding: "24px", textAlign: "center" };
const labelStyle = { fontSize: "14px", fontWeight: "700", color: "#334155", marginBottom: "8px", display: "block" };
const inputStyle = { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", marginBottom: "15px", boxSizing: "border-box", transition: "all 0.2s", background: "#fff" };
const sectionTitle = { fontSize: "16px", fontWeight: "800", color: "#ea580c", borderBottom: "2px solid #ffedd5", paddingBottom: "5px", margin: "10px 0 20px" };
const sectionDividerGreen = { background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", color: "#14532d", padding: "10px 16px", borderRadius: "10px", fontWeight: "700", fontSize: "14px", textAlign: "center", margin: "30px 0 15px 0" };
const sectionDividerOrange = { ...sectionDividerGreen, background: "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)", color: "#7c2d12" };
const fileBox = { background: "#f8fafc", padding: "15px", borderRadius: "14px", border: "2px dashed #cbd5e1", transition: "all 0.2s" };
const fileLabel = { margin: "0 0 10px 0", fontSize: "13px", fontWeight: "700", color: "#334155" };
const previewContainerStyle = { marginTop: "12px", display: "flex", justifyContent: "flex-start" };
const thumbStyle = { maxWidth: "120px", maxHeight: "85px", objectFit: "cover", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", border: "1px solid #e2e8f0" };
const primaryButtonStyle = { width: "100%", padding: "16px", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "#ffffff", border: "none", borderRadius: "14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.2)" };
const payButtonStyle = { ...primaryButtonStyle, background: "linear-gradient(135deg, #ea580c 0%, #ca8a04 100%)", boxShadow: "0 10px 15px -3px rgba(234, 88, 12, 0.2)" };