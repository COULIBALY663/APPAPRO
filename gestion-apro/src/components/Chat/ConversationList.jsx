import React from 'react';

export default function ConversationList({ conversations, selectedConversation, onSelect }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Messages récents</h3>

      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv)}
          style={{
            ...styles.item,
            ...(selectedConversation?.id === conv.id ? styles.activeItem : {}),
          }}
        >
          <div style={styles.header}>
            <span style={styles.name}>{conv.name}</span>
            <span style={styles.date}>{conv.lastDate}</span>
          </div>
          <p style={styles.lastMessage}>{conv.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    borderRight: "1px solid #e2e8f0",
    padding: "20px",
    background: "#fff",
    height: "100vh",
    overflowY: "auto",
  },
  title: { fontSize: "1.2rem", marginBottom: "20px", color: "#1e293b" },
  item: {
    padding: "15px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
    transition: "all 0.2s",
  },
  activeItem: {
    background: "#f8fafc",
    borderColor: "#3b82f6",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "5px" },
  name: { fontWeight: "bold", color: "#334155" },
  date: { fontSize: "0.75rem", color: "#94a3b8" },
  lastMessage: { fontSize: "0.85rem", color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }
};