import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Certificat() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); 
  const [loading, setLoading] = useState(false);
  const [createdData, setCreatedData] = useState(null);
  const [preview, setPreview] = useState({});

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
  });

  const [files, setFiles] = useState({
    extrait: null,
    parent_recto: null,
    parent_verso: null,
    recto_piece: null,
    verso_piece: null,
    acte_individuel: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setFiles((prev) => ({
      ...prev,
      [name]: file
    }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview((prev) => ({
          ...prev,
          [name]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    loading || setLoading(true);

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

      const res = await fetch("http://localhost:3000/certificat", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur création certificat");

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

  const handlePayNow = async () => {
    const certificatId = createdData?.id || createdData?.IDENTIFIANT || createdData?.id_certificat;

    if (!certificatId) {
      alert("❌ Erreur : Impossible de récupérer l'identifiant du certificat.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://wooing-whacking-epidermal.ngrok-free.dev/paiement/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telephone: form.telephone,
          montant: 200,
          type_service: "certificat",
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

  const containerStyle = { maxWidth: "800px", margin: "20px auto", padding: "30px", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", fontFamily: "Arial, sans-serif" };
  const inputStyle = { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" };
  const buttonStyle = { width: "100%", padding: "14px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" };
  const messageBoxStyle = { textAlign: "center", padding: "30px 20px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e3e3e3" };

  if (step === "success") {
    return (
      <div style={containerStyle}>
        <div style={messageBoxStyle}>
          <h2 style={{ color: "#28a745" }}>🎉 Félicitations !</h2>
          <button style={{ ...buttonStyle, marginTop: "20px", width: "auto" }} onClick={() => navigate("/dashboard")}>Aller au Dashboard</button>
        </div>
      </div>
    );
  }

  if (step === "waiting_payment") {
    return (
      <div style={containerStyle}>
        <div style={messageBoxStyle}>
          <h2 style={{ color: "orange" }}>📩 Informations reçues !</h2>
          <button style={{ ...buttonStyle, backgroundColor: "#28a745", marginTop: "20px" }} onClick={handlePayNow} disabled={loading}>
            {loading ? "⏳ Redirection..." : "💳 Payer maintenant"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", background: "orange", color: "#fff", padding: "10px", borderRadius: "4px" }}>📄 DEMANDE DE CERTIFICAT DE NATIONALITE</h2>
      <form onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" onChange={handleChange} required style={inputStyle} />
        <input name="prenom" placeholder="Prénom" onChange={handleChange} required style={inputStyle} />
        <input name="telephone" placeholder="Téléphone" onChange={handleChange} required style={inputStyle} />

        <h3 style={{backgroundColor:"green", color:"#fff", padding: "10px", textAlign:"center"}}> Documents obligatoires</h3>
        <label style={{ fontWeight: "bold", display: "block", marginTop: "10px" }}>Extrait de moins d'un an du demandeur</label>
        <input type="file" name="extrait" onChange={handleFileChange} required accept="image/*" style={{ margin: "5px 0 15px 0" }} />
        {preview.extrait && <img src={preview.extrait} alt="Aperçu" style={{ maxWidth: "10%", height: "auto", margin: "10px 0" }} />}

        <label style={{ fontWeight: "bold", display: "block" }}>Parent Recto</label>
        <input type="file" name="parent_recto" onChange={handleFileChange} required accept="image/*" style={{ margin: "5px 0 15px 0" }} />
        {preview.parent_recto && <img src={preview.parent_recto} alt="Aperçu" style={{ maxWidth: "10%", height: "auto", margin: "10px 0" }} />}
        
        <label style={{ fontWeight: "bold", display: "block" }}>Parent Verso</label>
        <input type="file" name="parent_verso" onChange={handleFileChange} required accept="image/*" style={{ margin: "5px 0 15px 0" }} />
        {preview.parent_verso && <img src={preview.parent_verso} alt="Aperçu" style={{ maxWidth: "10%", height: "auto", margin: "10px 0" }} />}

        <h3 style={{backgroundColor:"#FFCC80", color:"#3e2723", padding:"10px", textAlign:"center"}}> Documents facultatifs</h3>
        <label style={{ display: "block" }}>Recto pièce</label>
        <input type="file" name="recto_piece" onChange={handleFileChange} accept="image/*" style={{ margin: "5px 0 15px 0" }} />
        {preview.recto_piece && <img src={preview.recto_piece} alt="Aperçu" style={{ maxWidth: "10%", height: "auto", margin: "10px 0" }} />}
        
        <label style={{ display: "block" }}>Verso pièce</label>
        <input type="file" name="verso_piece" onChange={handleFileChange} accept="image/*" style={{ margin: "5px 0 15px 0" }} />
        {preview.verso_piece && <img src={preview.verso_piece} alt="Aperçu" style={{ maxWidth: "10%", height: "auto", margin: "10px 0" }} />}

        <label style={{ display: "block" }}>Acte individuel</label>
        <input type="file" name="acte_individuel" onChange={handleFileChange} accept="image/*" style={{ margin: "5px 0 15px 0" }} />
        {preview.acte_individuel && <img src={preview.acte_individuel} alt="Aperçu" style={{ maxWidth: "10%", height: "auto", margin: "10px 0" }} />}
        
        <br /><br />
        <button type="submit" style={buttonStyle} disabled={loading}>{loading ? "⏳ Envoi des documents..." : "Envoyer la demande"}</button>
      </form>
    </div>
  );
}