// src/components/PodcastGenerator.jsx
import { useState } from "react";
import { generateFullPodcast } from "../api";

export default function PodcastGenerator({ theme, topic }) {
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleGeneratePodcast = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await generateFullPodcast(theme, topic);
      console.log("Full Podcast Data:", data);
      setPodcast(data);
      setIsRegenerating(false);
      setLoading(false);
    } catch (err) {
      console.error("Error generating podcast:", err);
      setError("Error generating podcast: " + err.message);
      setLoading(false);
    }
  };

  const handleRegeneratePodcast = async () => {
    setError("");
    setIsRegenerating(true);
    try {
      const data = await generateFullPodcast(theme, topic);
      console.log("Regenerated Podcast:", data);
      setPodcast(data);
      setLoading(false);
    } catch (err) {
      console.error("Error regenerating podcast:", err);
      setError("Error regenerating podcast: " + err.message);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6 border border-slate-600/40">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-50">Generate Full Podcast</h2>
      <p className="text-slate-300">
        <strong>Theme:</strong> {theme} • <strong>Topic:</strong> {topic}
      </p>

      {!podcast ? (
        <button
          onClick={handleGeneratePodcast}
          disabled={loading}
          className="w-full primary-btn p-4 rounded-xl font-bold text-lg disabled:opacity-50 transition"
        >
          {loading ? "Generating your podcast..." : "Generate Full Podcast"}
        </button>
      ) : (
        <div className="space-y-4">
          {isRegenerating && (
            <div className="bg-blue-900/30 border border-blue-400/60 rounded-xl p-4">
              <p className="text-blue-100 font-semibold">Here's another version...</p>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleRegeneratePodcast}
              disabled={isRegenerating}
              className="flex-1 bg-slate-800 text-slate-100 border border-slate-500 p-3 rounded-xl hover:bg-slate-700 disabled:opacity-50 transition font-semibold"
            >
              {isRegenerating ? "Regenerating..." : "Regenerate Podcast"}
            </button>
          </div>
        </div>
      )}

      {error && <div className="bg-red-900/30 border border-red-500/70 text-red-200 p-4 rounded-xl">{error}</div>}

      {loading && !podcast && (
        <div className="text-center py-8">
          <p className="text-slate-300 mb-4">Creating your podcast content...</p>
          <div className="animate-spin text-5xl mb-4">🎙️</div>
        </div>
      )}

      {podcast && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-600 rounded-xl p-4">
            <h3 className="text-xl font-bold text-slate-100 mb-3">Episode Topic</h3>
            <p className="text-slate-200 leading-relaxed">{podcast.topic}</p>
          </div>

          <div className="bg-slate-900/70 border border-slate-600 rounded-xl p-4">
            <h3 className="text-xl font-bold text-slate-100 mb-3">Episode Outline</h3>
            <div className="bg-[#060a16] p-4 rounded-xl whitespace-pre-wrap text-slate-200 text-sm max-h-64 overflow-y-auto font-mono border border-slate-700">
              {podcast.outline}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-600 rounded-xl p-4">
            <h3 className="text-xl font-bold text-slate-100 mb-3">Complete Episode Script</h3>
            <div className="bg-[#060a16] p-4 rounded-xl whitespace-pre-wrap text-slate-200 text-sm max-h-96 overflow-y-auto border border-slate-700 leading-relaxed">
              {podcast.script}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(podcast.script);
                alert("Script copied to clipboard!");
              }}
              className="flex-1 primary-btn p-3 rounded-xl transition font-semibold"
            >
              Copy Script
            </button>
            <button
              onClick={() => {
                const element = document.createElement("a");
                element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(podcast.script));
                element.setAttribute("download", `podcast-${Date.now()}.txt`);
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="flex-1 bg-slate-800 text-slate-100 border border-slate-500 p-3 rounded-xl hover:bg-slate-700 transition font-semibold"
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}