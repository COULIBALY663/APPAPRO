import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Écrire un message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSend} style={styles.button}>
        Envoyer
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    marginTop: "10px",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
};