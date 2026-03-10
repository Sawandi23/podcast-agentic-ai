// src/components/ChatPage.jsx
import { useState } from "react";
import { generalChat } from "../api";

export default function ChatPage({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setError("");

    // Add user message to chat
    setMessages([...messages, { type: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await generalChat(userMessage);
      console.log("Chat Response:", response);
      
      // Extract the response text
      const assistantMessage = response.response || "Sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { type: "assistant", text: assistantMessage }]);
      setLoading(false);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-100">Chat Assistant</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-800 border border-slate-500 text-slate-100 rounded-lg hover:bg-slate-700 transition"
          >
            ← Back
          </button>
        </div>

        <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[80vh] border border-slate-600">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-4xl mb-4">💬</p>
                  <p className="text-slate-400 text-lg">No messages yet. Start a conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-100 border border-slate-600 rounded-bl-none"
                    }`}
                  >
                    <p className="break-words">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none border border-slate-600">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/70 text-red-200 p-3 mx-6 rounded-lg mt-2">
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-600 p-4 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                placeholder="Ask me something about podcasts..."
                disabled={loading}
                className="flex-1 border border-slate-500 bg-slate-900 text-slate-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="primary-btn px-6 py-3 rounded-lg disabled:opacity-50 transition font-semibold"
              >
                {loading ? "⏳" : "📤"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
