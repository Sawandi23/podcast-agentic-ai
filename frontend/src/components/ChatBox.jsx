// src/components/ChatBox.jsx
import { useState } from "react";
import { generalChat } from "../api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const quickQuestions = [
    "How can I improve this podcast?",
    "What's another topic idea?",
    "Can you suggest transitions?",
    "How do I record this?",
  ];

  const sendMessage = async (messageText = null) => {
    const userMsg = messageText || input;
    if (!userMsg.trim()) return;

    setMessages([...messages, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await generalChat(userMsg);
      setMessages((prev) => [...prev, { from: "ai", text: response.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: "ai", text: "Sorry, I couldn't process that. Try again!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 primary-btn rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition text-2xl z-40"
      >
        💬
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 max-w-[95vw] glass-card border border-slate-600 rounded-xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-slate-900/80 text-slate-100 p-4 rounded-t-xl flex justify-between items-center border-b border-slate-600">
            <h3 className="font-bold text-lg">🤖 Podcast Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl hover:bg-slate-700 rounded p-1"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-transparent">
            {messages.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">
                👋 Hi! I'm here to help with your podcast. Ask me anything!
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block p-3 rounded-lg max-w-xs ${
                    m.from === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 border border-slate-600 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-block p-3 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg">
                  ⏳ Thinking...
                </span>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 0 && (
            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-600">
              <p className="text-xs font-semibold text-slate-300 mb-2">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs bg-slate-800 border border-slate-500 text-slate-100 p-2 rounded-lg hover:bg-slate-700 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-600 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 border border-slate-500 bg-slate-900 text-slate-100 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="primary-btn p-2 rounded-lg disabled:opacity-50 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}