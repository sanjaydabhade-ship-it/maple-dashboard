
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Lead, DashboardMetrics } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface MapleAIProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  metrics: { today: DashboardMetrics; mtd: DashboardMetrics; ytd: DashboardMetrics };
}

const MapleAI: React.FC<MapleAIProps> = ({ isOpen, onClose, leads, metrics }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('maple_ai_chat_history');
    const savedDraft = localStorage.getItem('maple_ai_chat_draft');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([{
        role: 'model',
        text: "hello, main Maple AI hoon, aapka Sales Assistance. main Sachin Kadam sir ke liye kaam karta hoon. Main aapki sales strategy aur data analysis mein kaise madad kar sakta hoon?"
      }]);
    }
    if (savedDraft) setInput(savedDraft);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('maple_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('maple_ai_chat_draft', input);
  }, [input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const context = `
        IDENTITY & INTRODUCTION: 
        Aapka naam Maple AI hai. Aap Sachin Kadam sir ke liye kaam karte hain.
        Greeting: "hello, main Maple AI hoon, aapka Sales Assistance. main Sachin Kadam sir ke liye kaam karta hoon."
        Sirf shuruat mein introduction dein, har sentence mein Sachin sir bolne ki zarurat nahi hai.

        FULL PERFORMANCE DATA (REAL-TIME):
        TODAY:
        - Social Media: ${metrics.today.socialMedia}
        - Walk-ins: ${metrics.today.walkins}
        - Reference: ${metrics.today.reference}
        - Broker: ${metrics.today.broker}
        - Total Leads: ${metrics.today.totalLeads}
        - Site Visits: ${metrics.today.siteVisits}
        - Ratio: ${metrics.today.ratio.toFixed(1)}%

        MTD:
        - Total Leads: ${metrics.mtd.totalLeads}
        - Site Visits: ${metrics.mtd.siteVisits}
        - Ratio: ${metrics.mtd.ratio.toFixed(1)}%
        
        INSTRUCTION: 
        1. Use EXACT numbers from the data above. If someone asks about social media leads today, answer accurately.
        2. Provide expert sales analysis in Hinglish. 
        3. Identify conversion leaks and suggest aggressive follow-up tactics.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      const responseText = response.text || "Sir, network glitch ki wajah se report ready nahi hai. Try again.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Server issue lag raha hai. Aapka conversation saved hai." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-950 border-l border-white/10 z-[150] shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
      <div className="p-6 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">🍁</div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Maple AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Sales Intelligence</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-white/5 text-slate-300 rounded-tl-none font-medium'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-indigo-500/20 p-4 rounded-2xl rounded-tl-none flex flex-col gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Calculating Metrics...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/30 border-t border-white/5">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask about Social Media leads..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-4 pr-16 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 transition-all resize-none h-24"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 bottom-3 w-10 h-10 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MapleAI;
