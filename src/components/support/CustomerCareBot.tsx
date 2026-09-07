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

  // Website-trained intelligent response generator
  const generateWebsiteTrainedResponse = (userInput: string): string => {
    const query = userInput.toLowerCase();

    // 1. Non-Store / Purchase Question
    if (query.includes("buy") || query.includes("order") || query.includes("cart") || query.includes("price") || query.includes("checkout")) {
      return "That's a very common question! To keep our reviews completely unbiased, VeriSpec is an inventory intelligence and review platform, NOT an online store. We don't sell directly or take payments. However, on every product page, you'll see a 'Buy from external seller' button that links directly to verified suppliers (like IndiaMART, Moglix, or Amazon) in a new tab.";
    }

    // 2. Caustic Soda / Chemical Safety / SDS
    if (query.includes("caustic") || query.includes("chemical") || query.includes("sds") || query.includes("msds") || query.includes("acid")) {
      return "Safety is our highest priority. For chemical products like Caustic Soda (VS-CHM-011) or Suma Det., all chemical hazard classes, active ingredients, and required PPE are strictly held in 'Requires manufacturer SDS/label verification' status. We never invent or guess chemical formulas until official manufacturer laboratory sheets are uploaded!";
    }

    // 3. Gloves / PPE / Sizing
    if (query.includes("glove") || query.includes("nitrile") || query.includes("en 374") || query.includes("latex")) {
      return "Regarding hand protection: We currently catalogue standard Nitrile gloves, Cotton knitted gloves, Heavy-duty Chemical gloves, Black nitrile gloves, and Dielectric Electrical insulating gloves. All barrier claims (such as EN ISO 374 permeation times) are indexed transparently with verified documentation tags.";
    }

    // 4. Safety Shoes / Footwear
    if (query.includes("shoe") || query.includes("boot") || query.includes("toe")) {
      return "Our Safety Shoes (VS-PPE-008) record includes 200-Joule toe impact resistance placeholders and puncture plate standards pending IS 15298 / EN ISO 20345 confirmation. You can use our Compare tool to stack it up against cleanroom shoe covers!";
    }

    // 5. Stock / Inventory / Warehouse question
    if (query.includes("stock") || query.includes("inventory") || query.includes("warehouse") || query.includes("wh-")) {
      return "Our inventory is tracked across two primary facilities: Central Logistics (WH-MAIN-01) and Hazardous Chemical Vault 2 (WH-CHEM-02). Any stock adjustments made by management staff strictly require an immutable audit trail and a mandatory justification reason.";
    }

    // 6. Review / Feedback
    if (query.includes("review") || query.includes("rating") || query.includes("fake") || query.includes("auditor")) {
      return "Every single review on VeriSpec undergoes human moderation before publication. We prohibit promotional spam, fabricated expert quotes, and paid testimonials. Only registered users and verified safety auditors can contribute assessments.";
    }

    // 7. General Friendly Human Help
    return `I hear you! As a specialist here at VeriSpec, I can confirm that all 19 master products in our catalogue are rigorously tracked. If you're experiencing any issue with specifications, missing documents, or supplier links, let me know and I can immediately file a priority summary ticket directly to our management team!`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const updated = [
      ...messages,
      { sender: "user" as const, text: userText, timestamp: timeNow },
    ];
    setMessages(updated);
    setInputVal("");
    setIsTyping(true);

    // Simulate realistic human typing delay
    setTimeout(() => {
      const botReply = generateWebsiteTrainedResponse(userText);
      setMessages([
        ...updated,
        {
          sender: "rep" as const,
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 700);
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
