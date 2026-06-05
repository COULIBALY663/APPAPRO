import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Timbre() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        telephone: "",
    });
    const [file, setFile] = useState({
        extrait: null,
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {   
     setForm({...form, [e.target.name]: e.target.value});
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;
        setFile((prev) => ({...prev, [name]: file}));
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        // champs texte
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        // fichier (IMPORTANT: nom inchangé)
        Object.entries(file).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });
        const res = await fetch("http://localhost:3000/api/timbre", {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
                alert("Demande de timbre créée avec succès !");
                navigate("/timbre");
            } else {
                alert("Erreur lors de la création de la demande de timbre.");
            }
            setLoading(false);
        };
    
    // Styles
    const containerStyle = {
        backgroundColor:  "#FCFCFC",
        maxWidth: "800px",
        margin: "50px auto",
    };
    const inputStyle = {
        width: "95%",
        padding: "20px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    };
    const buttonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
    };
    const imgStyle = {
        maxWidth: "100%",
        marginTop: "10px",
    };
    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: "10px", backgroundColor: "orange", padding: "10px", color: "#fff" }}>DEMANDE DE TIMBRE</h2>
            <form onSubmit={handleSubmit}>
                
                <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    style={inputStyle}
                    value={form.nom}
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    style={inputStyle}
                    value={form.prenom}
                    required
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="telephone"
                    placeholder="Téléphone"
                    style={inputStyle}
                    value={form.telephone}
                    onChange={handleChange}
                />
                <h2 style={{ marginBottom: "10px", backgroundColor: "white", color: "#000" }}>Document à fournir</h2>
                <label >extrait:</label>
                <input type="file" name="extrait" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
                {preview && <img src={preview} alt="Preview" style={imgStyle} />}
                <button type="submit" style={buttonStyle} disabled={loading}>
                    {loading ? "Envoi en cours..." : "Soumettre"}
                </button>
            </form>
        </div>
    );
}