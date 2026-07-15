const handleBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Convertir les fichiers en Base64
  const rectoBase64 = await handleBase64(files.recto_piece);
  const versoBase64 = await handleBase64(files.verso_piece);

  // 2. Sauvegarde temporaire
  sessionStorage.setItem("coursier_temp_data", JSON.stringify({
    formData,
    files: { recto: rectoBase64, verso: versoBase64 }
  }));

  // 3. Appel Paiement
  const res = await fetch("https://appapro.onrender.com/paiement/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ montant: 200, type: "coursier" }),
  });
  
  const { payment_url } = await res.json();
  window.location.href = payment_url;
};