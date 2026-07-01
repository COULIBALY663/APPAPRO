import React from "react";

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelect,
}) {
  return (
    <div style={styles.container}>
      <h3>Conversations</h3>

      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv)}
          style={{
            ...styles.item,
            background:
              selectedConversation?.id === conv.id ? "#e2e8f0" : "#fff",
          }}
        >
          {conv.name}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    width: "30%",
    borderRight: "1px solid #ddd",
    padding: "10px",
  },
  item: {
    padding: "10px",
    marginBottom: "5px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "1px solid #eee",
  },
};