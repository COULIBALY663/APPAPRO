export const getFileUrl = (file) => {
  if (!file) return null;

  // Si c'est déjà une URL complète (Cloudinary), on la retourne telle quelle
  if (file.toString().startsWith('http')) {
    return file;
  }

  // Sinon, c'est l'ancien format (nom de fichier local), on ajoute le préfixe
  const fileName = file
    .toString()
    .split("\\")
    .pop()
    .split("/")
    .pop();

  return `https://appapro.onrender.com/uploads/${fileName}`;
};

export const renderFile = (file) => {
  if (!file) {
    return "Aucun";
  }

  const url = getFileUrl(file);

  return (
    <div>
      <a href={url} target="_blank" rel="noreferrer">
        <img
          src={url}
          alt="fichier"
          width="50"
          style={{
            borderRadius: "5px",
            cursor: "pointer",
            objectFit: "cover", // Ajouté pour éviter que l'image ne soit déformée
            height: "50px"
          }}
          // Gestion d'erreur au cas où l'image ne charge pas
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      </a>

      <br />

      <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: "10px" }}>
        📥 Télécharger
      </a>
    </div>
  );
};