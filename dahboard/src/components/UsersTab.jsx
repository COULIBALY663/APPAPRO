import React from "react";

export default function UsersTab({ users, onDeleteUser }) {
  // Sécurité : si users est undefined/null, on utilise un tableau vide []
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div>
      <h2>👥 Gestion des Utilisateurs</h2>
      <p style={{ fontWeight: "bold", color: "#555" }}>Total: {safeUsers.length}</p>
      
      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: "collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <thead>
          <tr style={{ backgroundColor: "black", textAlign: "left", color: "white" }}>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {safeUsers.map((u) => {
            const id = u.users_id || u.id;
            return (
              <tr key={id} style={{ borderBottom: "1px solid black" }}>
                <td ><b>#{id}</b></td>
                <td>{u.nom}</td>
                <td>{u.prenom}</td>
                <td>{u.email}</td>
                <td>
                  <button 
                    onClick={() => onDeleteUser(id)} 
                    style={{ background: "#dc3545", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}