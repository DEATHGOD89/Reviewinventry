"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  SendHorizonal,
  FileText,
  CheckCircle2,
  AlertCircle,
  Minimize2,
} from "lucide-react";
import {
  ChatMessage,
  createSupportTicketFromChat,
} from "@/lib/services/support-tickets";

// Rotating realistic human support reps
const SUPPORT_REPS = [
  { name: "Sarah Jenkins", role: "Senior PPE & Cleanroom Specialist", avatar: "SJ" },
  { name: "Marcus Vance", role: "Chemical & Industrial Compliance Desk", avatar: "MV" },
  { name: "Elena Rostova", role: "Hazardous Materials & SDS Advisor", avatar: "ER" },
  { name: "David Chen", role: "Industrial Ergonomics & Safety Auditor", avatar: "DC" },
  { name: "Aisha Al-Mansoor", role: "Plant Hygiene & Containment Lead", avatar: "AA" },
];

export const CustomerCareBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRep, setActiveRep] = useState(SUPPORT_REPS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [ticketDispatched, setTicketDispatched] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rotate representative per chat session
  useEffect(() => {
    const randomRep = SUPPORT_REPS[Math.floor(Math.random() * SUPPORT_REPS.length)];
    setActiveRep(randomRep);

    setMessages([
      {
        sender: "rep",
        text: `Hello! I'm ${randomRep.name}, ${randomRep.role} at VeriSpec. How can I assist you with product specifications, SDS documentation, or inventory questions today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendUserPrompt = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userText = text.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updated = [
      ...messages,
      { sender: "user" as const, text: userText, timestamp: timeNow },
    ];
    setMessages(updated);
    setInputVal("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          repName: activeRep.name,
          repRole: activeRep.role,
        }),
      });

      const data = await res.json();
      const botReply =
        data.reply ||
        "I'm right here to assist! Could you describe what you need help with in our inventory or specifications?";

      setMessages([
        ...updated,
        {
          sender: "rep" as const,
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages([
        ...updated,
        {
          sender: "rep" as const,
          text: `I'm right here with you! Could you describe what issue you're encountering on the platform?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendUserPrompt(inputVal);
  };

  // Dispatch Chat to Management and Owner Portal
  const handleDispatchTicket = async () => {
    try {
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user")?.text || "General platform inquiry";
      
      await createSupportTicketFromChat({
        visitorName: visitorName || "Website Visitor",
        assignedRepName: activeRep.name,
        assignedRepRole: activeRep.role,
        issueCategory: lastUserMsg.toLowerCase().includes("sds")
          ? "Chemical SDS Request"
          : lastUserMsg.toLowerCase().includes("buy")
          ? "Non-Store Procurement Inquiry"
          : "Specification & Inventory Support",
        aiSummary: `Customer contacted ${activeRep.name} regarding: "${lastUserMsg.slice(0, 120)}". Representative provided verified website guidance.`,
        recommendedStaffAction: "Review customer chat inquiry in management portal and follow up if specific documentation was requested.",
        transcript: messages,
      });

      setTicketDispatched(true);
      setTimeout(() => setTicketDispatched(false), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Launcher Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-zinc-950 text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-3 border border-white/10 group"
          title="Talk with VeriSpec Support Specialist"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-zinc-950 font-bold text-xs flex items-center justify-center">
              {activeRep.avatar}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{activeRep.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-cyan-200">AI Care</span>
            </div>
            <div className="text-[10px] text-zinc-400">Online &bull; Live Support</div>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[560px] rounded-3xl bg-white border border-zinc-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-zinc-950 font-bold text-sm flex items-center justify-center shadow-md">
                  {activeRep.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{activeRep.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold">
                    Live Specialist
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                  {activeRep.role}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Ticket Dispatch Banner */}
          <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500 font-medium">Auto-summarizes for Owner & Staff:</span>
            <button
              onClick={handleDispatchTicket}
              disabled={ticketDispatched}
              className="font-bold text-cyan-700 hover:text-cyan-900 underline flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              <span>{ticketDispatched ? "Ticket Sent ✓" : "Send Ticket to Portal"}</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f9f9fb] text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-zinc-950 text-white rounded-br-xs shadow-xs"
                      : "bg-white text-zinc-800 border border-zinc-200 rounded-bl-xs shadow-xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-zinc-400 font-mono mt-1 px-1">
                  {m.sender === "user" ? "You" : activeRep.name} &bull; {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-zinc-200 w-24 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "Caustic Soda SDS status",
              "How to buy nitrile gloves?",
              "Print warehouse bin labels",
              "Zero-hallucination policy",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => sendUserPrompt(chip)}
                className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] whitespace-nowrap font-medium transition-colors cursor-pointer shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about caustic soda SDS, nitrile gloves, buying..."
              className="flex-1 px-4 py-2.5 rounded-full border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 transition-colors shadow-xs"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
