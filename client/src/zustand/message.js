import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const useMessageStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isDataFetched: false,
  currentChatId: null,

  setCurrentChatId: (chatId) => {
    // Only update if it's a different chat
    if (get().currentChatId === chatId) return;
    
    set({
      currentChatId: chatId,
      messages: [],
      isDataFetched: false,
      isLoading: true,
    });
  },

  fetchMessages: async (chatId) => {
    set({ isLoading: true, isDataFetched: false });

    try {
      const response = await api.get(`/messages/${chatId}`);

      // Check if this is still the current chat (prevent race conditions)
      if (get().currentChatId !== chatId) {
        return;
      }

      // Handle different response formats
      let messagesData = [];
      if (Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data.messages) {
        messagesData = response.data.messages;
      } else if (response.data.data) {
        messagesData = response.data.data;
      }

      set({
        messages: messagesData,
        isLoading: false,
        isDataFetched: true,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ 
        isLoading: false, 
        isDataFetched: true,
        messages: [] 
      });
    }
  },

  sendMessage: async (chatId, messageData) => {
    try {
      const response = await api.post(`/messages/send/${chatId}`, messageData);

      // Only add message if we're still on the same chat
      if (get().currentChatId === chatId) {
        // Handle backend response that wraps message in success object
        const newMessage = response.data.message || response.data;
        
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  clearMessages: () => set({ messages: [], currentChatId: null }),
}));