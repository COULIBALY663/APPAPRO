import React, { useState } from "react";
import axios from "axios";
import { useChat } from "../hooks/useChat";

export default function Chat() {
  const [selected, setSelected] = useState(null); // { phone: "12345", name: "Jean" }
  const { messages, setMessages } = useChat(selected?.phone);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    await axios.post('https://appapro.onrender.com/support/send', {
      to: selected.phone,
      message: inputText
    });
    
    setMessages([...messages, { sender: 'SUPPORT', content: inputText, createdAt: new Date() }]);
    setInputText("");
  };

  return (
    <div className="chat-container" style={{ display: "flex", height: "90vh" }}>
      {/* Colonne Gauche : Contacts */}
      <div style={{ width: "300px", borderRight: "1px solid #ccc" }}>
        <h2>Conversations</h2>
        <button onClick={() => setSelected({ phone: "2250700000000", name: "Client Test" })}>
          Client Test
        </button>
      </div>

      {/* Colonne Droite : Messages */}
      <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
        {selected ? (
          <>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ textAlign: m.sender === 'SUPPORT' ? 'right' : 'left', margin: "10px" }}>
                  <span style={{ background: m.sender === 'SUPPORT' ? '#dcf8c6' : '#eee', padding: "8px", borderRadius: "10px" }}>
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: "10px" }}>
              <input value={inputText} onChange={(e) => setInputText(e.target.value)} style={{ flex: 1 }} />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </>
        ) : (
          <p>Sélectionnez une conversation pour commencer.</p>
        )}
      </div>
    </div>
  );
}