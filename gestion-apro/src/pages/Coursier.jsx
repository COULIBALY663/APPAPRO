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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    // Validation : Limite de taille de 2 Mo
    if (inputFiles[0] && inputFiles[0].size > 2 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 2MB)");
      return;
    }
    setFiles({ ...files, [name]: inputFiles[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (files.recto_piece) data.append('recto_piece', files.recto_piece);
    if (files.verso_piece) data.append('verso_piece', files.verso_piece);

    try {
      await axios.post(`https://appapro.onrender.com/coursier/${paiementId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Coursier créé avec succès !');
      // Réinitialiser le formulaire
      setFormData({ IP: '', FILIERE: '', nom: '', date_nais: '', Lieu_nais: '', telephone: '' });
      setFiles({ recto_piece: null, verso_piece: null });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors de la soumission du dossier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-xl rounded-lg max-w-lg mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Inscription Coursier</h2>
      
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <input name="nom" placeholder="Nom complet" onChange={handleChange} value={formData.nom} className="block w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-blue-500" required />
      <input name="IP" placeholder="IP" onChange={handleChange} value={formData.IP} className="block w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-blue-500" required />
      <input name="FILIERE" placeholder="Filière" onChange={handleChange} value={formData.FILIERE} className="block w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-blue-500" required />
      <input name="date_nais" type="date" onChange={handleChange} value={formData.date_nais} className="block w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-blue-500" required />
      <input name="Lieu_nais" placeholder="Lieu de naissance" onChange={handleChange} value={formData.Lieu_nais} className="block w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-blue-500" required />
      <input name="telephone" placeholder="Téléphone" onChange={handleChange} value={formData.telephone} className="block w-full mb-4 p-3 border rounded focus:ring-2 focus:ring-blue-500" />

      <label className="block text-sm font-medium text-gray-700 mb-1">Recto pièce :</label>
      <input name="recto_piece" type="file" onChange={handleFileChange} className="mb-4 block w-full text-sm text-gray-500" />

      <label className="block text-sm font-medium text-gray-700 mb-1">Verso pièce :</label>
      <input name="verso_piece" type="file" onChange={handleFileChange} className="mb-6 block w-full text-sm text-gray-500" />

      <button 
        disabled={loading}
        type="submit" 
        className={`w-full p-3 text-white rounded font-bold transition-colors ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Traitement en cours...' : 'Soumettre le dossier'}
      </button>
    </form>
  );
};

export default Coursier;