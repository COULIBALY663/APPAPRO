import React from "react";

export default function MessageBox({ messages, currentUser }) {
  return (
    <div style={styles.container}>
      {messages.map((msg) => {
        const isMe = msg.senderId === currentUser;
        
        return (
          <div key={msg.id} style={{ ...styles.wrapper, alignSelf: isMe ? "flex-end" : "flex-start" }}>
            <div style={{
              ...styles.message,
              background: isMe ? "#2563eb" : "#f1f5f9",
              color: isMe ? "#fff" : "#1e293b",
              borderBottomRightRadius: isMe ? "2px" : "15px",
              borderBottomLeftRadius: isMe ? "15px" : "2px",
            }}>
              {msg.content}
              <span style={{ ...styles.time, color: isMe ? "#bfdbfe" : "#94a3b8" }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "#ffffff",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "70%",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "15px",
    fontSize: "0.95rem",
    lineHeight: "1.4",
    position: "relative",
  },
  time: {
    fontSize: "0.7rem",
    display: "block",
    marginTop: "5px",
    textAlign: "right",
  }
};