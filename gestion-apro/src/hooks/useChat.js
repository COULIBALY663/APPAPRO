import { useState, useCallback } from 'react';
import axios from 'axios';

export const useChat = (apiBase) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async (conversationId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiBase}/support/messages/${conversationId}`);
      setMessages(data);
    } catch (err) {
      console.error("Erreur de récupération:", err);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  const sendMessage = async (conversationId, content) => {
    const tempMsg = { id: Date.now(), sender: 'SUPPORT', content, createdAt: new Date() };
    setMessages(prev => [...prev, tempMsg]);
    
    try {
      await axios.post(`${apiBase}/support/send`, { conversationId, content });
    } catch (err) {
      // Logique de rollback si échec
    }
  };

  return { messages, fetchHistory, sendMessage, loading };
};