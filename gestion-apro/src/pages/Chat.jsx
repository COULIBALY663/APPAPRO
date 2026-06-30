import React from 'react';
import { useChat } from '../hooks/useChat';

export default function SupportDashboard() {
  const { messages, sendMessage, loading } = useChat('https://appapro.onrender.com');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Conversations */}
      <aside className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b font-bold text-lg">Support Client</div>
        {/* Liste des conversations ici */}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'SUPPORT' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-2 rounded-2xl ${m.sender === 'SUPPORT' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        
        {/* Input Area */}
        <footer className="p-4 bg-white border-t">
           <input 
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
             placeholder="Écrire un message..."
           />
        </footer>
      </main>
    </div>
  );
}