import React, { useState } from "react";

import ConversationList from "../components/Chat/ConversationList";
import MessageBox from "../components/Chat/MessageBox";
import MessageInput from "../components/Chat/MessageInput";

export default function Chat() {
  const currentUser = 1;

  const [selectedConversation, setSelectedConversation] = useState(null);

  const [conversations] = useState([
    { id: 1, name: "Jean" },
    { id: 2, name: "Marie" },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, senderId: 1, content: "Bonjour" },
    { id: 2, senderId: 2, content: "Salut !" },
  ]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      senderId: currentUser,
      content: text,
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div style={{ display: "flex", height: "80vh" }}>
      
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelect={setSelectedConversation}
      />

      <div style={{ flex: 1, padding: "15px" }}>
        {selectedConversation ? (
          <>
            <h3>Discussion avec {selectedConversation.name}</h3>

            <MessageBox
              messages={messages}
              currentUser={currentUser}
            />

            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <p>Sélectionnez une conversation</p>
        )}
      </div>
    </div>
  );
}