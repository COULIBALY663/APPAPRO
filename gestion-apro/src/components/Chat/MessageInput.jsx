import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  // Permet d'envoyer avec la touche Entrée
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Écrire votre réponse ici..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={styles.input}
      />
      <button 
        onClick={handleSend} 
        style={{
          ...styles.button,
          opacity: text.trim() ? 1 : 0.6,
          cursor: text.trim() ? "pointer" : "not-allowed"
        }}
        disabled={!text.trim()}
      >
        Envoyer
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    padding: "15px",
    background: "#fff",
    borderTop: "1px solid #e2e8f0",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    transition: "background 0.2s",
  },
};