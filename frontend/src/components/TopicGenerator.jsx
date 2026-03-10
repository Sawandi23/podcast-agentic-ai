// src/components/TopicGenerator.jsx
import { useState } from "react";
import { generateMoreTopics, generateTopics } from "../api";

export default function TopicGenerator({ onTopicSelect }) {
  const [theme, setTheme] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError("Please enter a theme");
      return;
    }
    setError("");
    setSelectedTopic("");
    setTopics([]);
    setLoading(true);
    try {
      const data = await generateTopics(theme);
      console.log("API Response:", data);
      setTopics((data.topics || []).map((t) => cleanTopicName(t)).filter(Boolean));
      setLoading(false);
    } catch (err) {
      console.error("Error generating topics:", err);
      setError("Error generating topics: " + err.message);
      setLoading(false);
    }
  };

  const handleGenerateMoreTopics = async () => {
    setError("");
    setIsLoadingMore(true);
    try {
      const data = await generateMoreTopics(theme);
      console.log("More Topics:", data);
      const nextTopics = (data.topics || []).map((t) => cleanTopicName(t));
      setTopics((prev) => [...new Set([...prev, ...nextTopics])]);
      setIsLoadingMore(false);
    } catch (err) {
      console.error("Error generating more topics:", err);
      setError("Error generating more topics: " + err.message);
      setIsLoadingMore(false);
    }
  };

  const cleanTopicName = (topic) => {
    return topic
      .replace(/^\s*(\d+[\).:-]?|[-*•])\s*/, "")
      .replace(/^topic\s*[:\-]\s*/i, "")
      .replace(/\s+/g, " ")
      .replace(/[.!?;:\-–—].*$/, "")
      .trim()
      .slice(0, 110);
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-600/40">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-50">Let's create your next podcast episode</h2>
      <p className="text-slate-300 mb-6">Start with a theme, choose a topic, then generate the full script instantly.</p>
      
      <div className="mb-4">
        <label className="block text-slate-200 font-semibold mb-2">What's your podcast theme?</label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g., Science Fiction, Technology, Business..."
          className="w-full border border-slate-500 bg-slate-900/80 text-slate-100 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full primary-btn p-3 rounded-xl font-semibold disabled:opacity-50 transition mb-4"
      >
        {loading ? "Generating topics..." : "Generate Topics"}
      </button>

      {error && <div className="bg-red-900/30 border border-red-500/70 text-red-200 p-3 rounded-xl mb-4">{error}</div>}

      {topics.length > 0 && (
        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-slate-200 font-semibold mb-3">Pick a topic you like:</label>
            <div className="grid gap-2">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedTopic === topic
                      ? "border-blue-400 bg-blue-500/15"
                      : "border-slate-600 bg-slate-900/60 hover:border-blue-400 hover:bg-blue-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-slate-100 font-medium">{topic}</p>
                    <button
                      onClick={() => setSelectedTopic(topic)}
                      className="px-3 py-1 bg-slate-800 text-slate-100 border border-slate-500 rounded-lg hover:bg-slate-700 transition text-sm font-semibold"
                    >
                      {selectedTopic === topic ? "Selected" : "Use Topic"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleGenerateMoreTopics}
              disabled={isLoadingMore}
              className="w-full mt-4 bg-slate-800 border border-slate-500 text-slate-100 p-3 rounded-xl hover:bg-slate-700 disabled:opacity-50 transition font-semibold"
            >
              {isLoadingMore ? "Getting more topics..." : "Generate More Topics"}
            </button>
          </div>

          {selectedTopic && (
            <div className="bg-slate-900/70 border border-blue-400/50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-slate-100 mb-3">Ready to generate?</h3>
              <p className="text-slate-300 mb-4">
                You've selected: <strong>{selectedTopic}</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => onTopicSelect(theme, selectedTopic)}
                  className="w-full primary-btn p-3 rounded-xl font-bold text-lg transition"
                >
                  Generate Full Podcast
                </button>
                <button
                  onClick={() => setSelectedTopic("")}
                  className="w-full bg-slate-800 text-slate-100 p-3 rounded-xl font-semibold border border-slate-500 hover:bg-slate-700 transition"
                >
                  Choose Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}