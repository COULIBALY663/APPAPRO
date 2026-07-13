import React, { useState } from 'react';
import axios from 'axios';

const CoursierForm = ({ paiementId }) => {
  const [formData, setFormData] = useState({
    IP: '',
    FILIERE: '',
    nom: '',
    date_nais: '',
    Lieu_nais: '',
    telephone: ''
  });

  const [files, setFiles] = useState({
    recto_piece: null,
    verso_piece: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    // Ajouter les champs texte
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Ajouter les fichiers
    if (files.recto_piece) data.append('recto_piece', files.recto_piece);
    if (files.verso_piece) data.append('verso_piece', files.verso_piece);

    try {
      const response = await axios.post(`https://appapro.onrender.com/coursier/${paiementId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Coursier créé avec succès !');
      console.log(response.data);
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl mb-4">Inscription Coursier</h2>
      
      <input name="nom" placeholder="Nom complet" onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input name="IP" placeholder="IP" onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input name="FILIERE" placeholder="Filière" onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input name="date_nais" type="date" onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input name="Lieu_nais" placeholder="Lieu de naissance" onChange={handleChange} className="block w-full mb-2 p-2 border" required />
      <input name="telephone" placeholder="Téléphone" onChange={handleChange} className="block w-full mb-2 p-2 border" />

      <label className="block mt-4">Recto pièce :</label>
      <input name="recto_piece" type="file" onChange={handleFileChange} className="mb-2" />

      <label className="block mt-2">Verso pièce :</label>
      <input name="verso_piece" type="file" onChange={handleFileChange} className="mb-4" />

      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Soumettre le dossier
      </button>
    </form>
  );
};

export default CoursierForm;