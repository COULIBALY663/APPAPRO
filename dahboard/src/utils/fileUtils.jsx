export const getFileUrl = (file) => {
  if (!file) return null;

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
          }}
        />
      </a>

      <br />

      <a href={url} target="_blank" rel="noreferrer">
        📥 Télécharger
      </a>
    </div>
  );
};