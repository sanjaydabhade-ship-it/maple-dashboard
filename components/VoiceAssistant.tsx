import React, { useState } from "react";

interface VoiceAssistantProps {}

const VoiceAssistant: React.FC<VoiceAssistantProps> = () => {
  const [loading, setLoading] = useState(false);

  const speak = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Give me today's CRM summary" }),
      });

      const data = await res.json();

      const utterance = new SpeechSynthesisUtterance(data.reply);
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);

    } catch (e) {
      alert("Voice error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={speak}
        disabled={loading}
        className="w-16 h-16 rounded-full bg-orange-600 text-white shadow-xl hover:scale-105 transition-all"
      >
        {loading ? "..." : "AI"}
      </button>
    </div>
  );
};

export default VoiceAssistant;
