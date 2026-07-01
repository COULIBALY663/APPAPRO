import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { Send, User, MessageSquare } from 'lucide-react';

export default function SupportDashboard() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [input, setInput] = useState('');
  const { messages, sendMessage, loading } = useChat('https://appapro.onrender.com');
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas lors de l'arrivée d'un message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() && selectedChatId) {
      sendMessage(selectedChatId, input);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Liste des conversations */}
      <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b bg-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare size={24} /> Support Client
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Exemple de liste de conversations */}
          <div onClick={() => setSelectedChatId('1')} className="p-4 border-b cursor-pointer hover:bg-blue-50 transition">
            <p className="font-semibold text-gray-800">Client #DM-2024-0158</p>
            <p className="text-sm text-gray-500 truncate">Problème de connexion...</p>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-2 flex-1 flex flex-col bg-white">
        {selectedChatId ? (
          <>
            <div className="p-4 border-b font-bold text-gray-700 bg-gray-50">
              Discussion en cours
            </div>
            
            {/* Fenêtre des messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((m, index) => (
                <div key={index} className={`flex ${m.sender === 'SUPPORT' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${m.sender === 'SUPPORT' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Footer Input */}
            <footer className="p-4 bg-white border-t flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Écrire une réponse..."
              />
              <button 
                onClick={handleSend}
                className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send size={18} /> Envoyer
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Sélectionnez une conversation pour commencer
          </div>
        )}
      </main>
    </div>
  );
}