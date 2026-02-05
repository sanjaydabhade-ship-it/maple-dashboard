import React, { useState } from "react";

const VoiceAssistant = () => {
  const [loading, setLoading] = useState(false);

  const talkToAI = async () => {
    setLoading(true);
    const res = await fetch("/api/voice");
    const data = await res.json();
    alert(data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply");
    setLoading(false);
  };

  return (
    <button
      onClick={talkToAI}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-orange-600 text-white shadow-lg"
    >
      {loading ? "..." : "AI"}
    </button>
  );
};

export default VoiceAssistant;
