import { useState, useEffect } from 'react';
import axios from 'axios';

export const useChat = (selectedPhone) => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!selectedPhone) return;
    try {
      const res = await axios.get(`https://appapro.onrender.com/support/messages/${selectedPhone}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur chargement messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Rafraîchissement automatique toutes les 5 secondes
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedPhone]);

  return { messages, setMessages };
};