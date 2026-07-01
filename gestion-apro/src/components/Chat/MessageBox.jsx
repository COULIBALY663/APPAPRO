import React from "react";

export default function MessageBox({ messages, currentUser }) {
  return (
    <div style={styles.container}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            ...styles.message,
            alignSelf:
              msg.senderId === currentUser ? "flex-end" : "flex-start",
            background:
              msg.senderId === currentUser ? "#2563eb" : "#e5e7eb",
            color:
              msg.senderId === currentUser ? "#fff" : "#000",
          }}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    height: "60vh",
    border: "1px solid #ddd",
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "60%",
  },
};