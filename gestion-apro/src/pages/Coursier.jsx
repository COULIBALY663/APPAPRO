import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CoursierForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); 
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({});

  const [formData, setFormData] = useState({
    IP: "",
    FILIERE: "",
    nom: "",
    date_nais: "",
    Lieu_nais: "",
    telephone: ""
  });

  const [files, setFiles] = useState({
    recto_piece: null,
    verso_piece: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file && file.size > 2 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 2 Mo)");
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Conversion des fichiers (votre logique actuelle)
      const toBase64 = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      const b64Files = {
        recto_piece: await toBase64(files.recto_piece),
        verso_piece: await toBase64(files.verso_piece),
      };

      // Appel Paiement avec un ID factice "999999" 
      // Comme votre backend attend un Number, le fait de passer 999999 
      // validera la condition "if (!certificat_id)"
      const res = await fetch("https://appapro.onrender.com/paiement/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telephone: formData.telephone,
          montant: 200,
          type_service: "coursier",
          certificat_id: 999999 // <--- L'ASTUCE EST ICI
        }),
      });

      const paymentData = await res.json();
      
      if (paymentData?.payment_url) {
        // Sauvegarde des données avec l'ID factice pour le suivi
        sessionStorage.setItem("pending_coursier_data", JSON.stringify({
          formData,
          files: b64Files,
          certificat_id: 999999 
        }));
        
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error(paymentData.message || "URL de paiement non générée");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Une erreur est survenue.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paiementId = urlParams.get("paiementId");

    const finalize = async () => {
      const stored = sessionStorage.getItem("pending_coursier_data");
      if (paiementId && stored) {
        const { formData, files } = JSON.parse(stored);
        
        const finalData = new FormData();
        Object.keys(formData).forEach(k => finalData.append(k, formData[k]));
        
        const base64ToBlob = (b64) => {
           const byteString = atob(b64.split(',')[1]);
           const ab = new ArrayBuffer(byteString.length);
           const ia = new Uint8Array(ab);
           for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
           return new Blob([ab], { type: 'image/jpeg' });
        };
        
        finalData.append("recto_piece", base64ToBlob(files.recto_piece));
        finalData.append("verso_piece", base64ToBlob(files.verso_piece));

        const res = await fetch(`https://appapro.onrender.com/coursier/${paiementId}`, {
          method: "POST",
          body: finalData
        });

        if (res.ok) {
          sessionStorage.removeItem("pending_coursier_data");
          setStep("success");
        }
      }
    };
    finalize();
  }, []);

  // ÉCRAN DE SUCCÈS
  if (step === "success") {
    return (
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 20px auto' }}>🎉</div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#065f46', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Inscription Validée !</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Votre paiement a été reçu. Votre dossier de coursier est désormais actif.</p>
          <button onClick={() => navigate("/dashboard")} style={{ padding: '12px 30px', backgroundColor: '#00B652', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>Aller au Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      {/* Cadre du formulaire */}
      <div style={{ width: '100%', maxWidth: '750px', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* En-tête Institutionnel ACADEMY PRO */}
        <div style={{ backgroundColor: '#ED5F07', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#ffffff', borderBottom: '2px solid #d65203' }}>
          <span style={{ fontSize: '24px' }}>📄</span>
          <h1 style={{ fontSize: '28px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0, textAlign: 'center' }}>
            Inscription au Service Coursier
          </h1>
        </div>

        <div style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
            
            {/* SECTION 1 : RENSEIGNEMENTS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#C45500', fontWeight: 'bold', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '40px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, textAlign: 'center' }}>
                  Informations Personnelles
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Nom complet <span style={{ color: '#ef4444' }}>*</span></label>
                  <input name="nom" value={formData.nom} onChange={handleChange} required placeholder="Ex : COULIBALY Jean" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Identifiant Permanent (IP) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input name="IP" value={formData.IP} onChange={handleChange} required placeholder="Identifiant officiel" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Filière d'étude <span style={{ color: '#ef4444' }}>*</span></label>
                  <input name="FILIERE" value={formData.FILIERE} onChange={handleChange} required placeholder="Ex : IDA, RIT..." style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Numéro de téléphone <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="Ex: 0700000000" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Date de naissance <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="date" name="date_nais" value={formData.date_nais} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Lieu de naissance <span style={{ color: '#ef4444' }}>*</span></label>
                  <input name="Lieu_nais" value={formData.Lieu_nais} onChange={handleChange} required placeholder="Ville de naissance" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>
            </div>

            {/* SECTION 2 : CHARGEMENT DES FICHIERS PRO (STYLE DRAG & DROP) */}
            <div>
              <div style={{ backgroundColor: '#D1F7DB', color: '#1E7E34', fontWeight: 'bold', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '25px', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid #bbf7d0', marginBottom: '20px' }}>
                 Documents Justificatifs Obligatoires
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* RECTO PIECE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Recto de la pièce <span style={{ color: '#ef4444' }}>*</span></span>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '24px', backgroundColor: '#f8fafc', cursor: 'pointer', position: 'relative', textAlign: 'center' }}>
                    <span style={{ fontSize: '24px', marginBottom: '8px' }}>📤</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Choisir le fichier Recto</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>PDF, PNG, JPG (Max 2Mo)</span>
                    <input type="file" name="recto_piece" onChange={handleFileChange} required accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} />
                    
                    {preview.recto_piece && (
                      <div style={{ marginTop: '10px', width: '50px', height: '50px', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <img src={preview.recto_piece} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </label>
                </div>

                {/* VERSO PIECE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}>Verso de la pièce <span style={{ color: '#ef4444' }}>*</span></span>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '24px', backgroundColor: '#f8fafc', cursor: 'pointer', position: 'relative', textAlign: 'center' }}>
                    <span style={{ fontSize: '24px', marginBottom: '8px' }}>📤</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155' }}>Choisir le fichier Verso</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>PDF, PNG, JPG (Max 2Mo)</span>
                    <input type="file" name="verso_piece" onChange={handleFileChange} required accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} />
                    
                    {preview.verso_piece && (
                      <div style={{ marginTop: '10px', width: '50px', height: '50px', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <img src={preview.verso_piece} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </label>
                </div>

              </div>
            </div>

            {/* BOUTON DE SOUMISSION VERT FINITIONS PREMIUM */}
            <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 35px',
                  backgroundColor: loading ? '#cbd5e1' : '#00B652',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '25px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {loading ? "⏳ Traitement et redirection..." : "💳 Payer et Soumettre ma demande"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}