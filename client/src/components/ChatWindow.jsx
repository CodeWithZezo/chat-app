import React, { useState, useEffect, useRef } from "react";
import { useMessageStore } from "../zustand/message";
import { useAuthStore } from "../zustand/auth"; // 👈 get logged-in user

const ChatWindow = () => {
  const {
    messages,
    currentChatId,
    isLoading,
    sendMessage,
    fetchMessages,
  } = useMessageStore();

  const { user } = useAuthStore(); // 👈 real user
  const currentUserId = user?._id;

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // 🔄 Fetch messages when chat changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId, fetchMessages]);

  // ⬇️ Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📤 Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !currentChatId) return;

    const text = newMessage;
    setNewMessage("");

    await sendMessage(currentChatId, { message: text });
  };

  // 🟡 No chat selected
  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-300">
        <p className="text-base-content/60">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  // 🟡 Loading
  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-3 bg-base-300">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`flex ${i % 2 ? "justify-start" : "justify-end"}`}
          >
            <div className="skeleton h-14 w-64 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-300 h-screen">
      {/* Header */}
      <div className="p-4 border-b border-base-content/10 bg-base-100">
        <h2 className="text-xl font-bold">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-base-content/60">
              No messages yet. Start the conversation!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isSentByMe = msg.senderId === currentUserId;

          return (
            <div
              key={msg._id}
              className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                  isSentByMe
                    ? "bg-primary text-primary-content"
                    : "bg-base-100"
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <p className="text-xs opacity-60 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-base-100 border-t border-base-content/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="input input-bordered flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
