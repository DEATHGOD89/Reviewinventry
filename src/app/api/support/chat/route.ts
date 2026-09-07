import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  sender: "user" | "rep";
  text: string;
  timestamp: string;
}

// Smart, human-like conversational engine that handles greetings, typos, and specific inquiries
function generateSmartHumanResponse(
  userInput: string,
  history: ChatMessage[],
  repName: string,
  repRole: string
): string {
  const query = userInput.toLowerCase().trim();

  // Normalize common typos
  const clean = query
    .replace(/\bisse\b|\bproblm\b|\bissu\b/g, "issue")
    .replace(/\bcna\b/g, "can")
    .replace(/\bpelase\b|\bplz\b|\bpls\b/g, "please")
    .replace(/\bchekc\b/g, "check")
    .replace(/\bhlp\b/g, "help")
    .replace(/\bwat\b/g, "what")
    .replace(/\bthsi\b/g, "this");

  const turnCount = history.filter((m) => m.sender === "user").length;
  const previousBotTexts = history.filter((m) => m.sender === "rep").map((m) => m.text.toLowerCase());

  // 1. Casual Greetings (hi, hello, hey, good morning, etc.)
  const isGreeting = /^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|howdy|sup)\b/i.test(clean);
  if (isGreeting && clean.split(/\s+/).length <= 4) {
    if (turnCount <= 1) {
      return `Hi there! I'm ${repName}. How's your day going? What can I help you find or check in our inventory today?`;
    }
    return `Hello again! How can I assist you right now? Feel free to ask about any product, safety standard, or warehouse stock.`;
  }

  // 2. Problem / Issue statement ("i have issue", "help me", "something is wrong", "cna you help me")
  const isIssueRequest =
    /\b(issue|problem|help|trouble|broken|error|assist|stuck|not working|question)\b/i.test(clean);

  if (isIssueRequest && !/\b(caustic|sds|glove|shoe|buy|price|stock|cart|order)\b/i.test(clean)) {
    // Check if we already asked them to describe the issue
    const alreadyAsked = previousBotTexts.some((t) => t.includes("what kind of issue") || t.includes("could you share"));
    if (alreadyAsked) {
      return `I'm completely listening! Tell me what's happening — for example, is there a problem with a product description, a missing SDS sheet, an external seller link, or something else on the site? I'm ready to help or log this for our supervisors.`;
    }
    return `I'm right here to help you! Could you share a few details about what's going on? For instance, are you having trouble finding a specific product, checking stock levels, or verifying a safety standard?`;
  }

  // 3. Purchasing / Buying / Pricing / Cart inquiries
  if (/\b(buy|order|cart|checkout|purchase|cost|price|quote|how to get)\b/i.test(clean)) {
    return `That's an important detail to clarify! VeriSpec is an inventory and safety verification platform — not an online shop. We don't take payments or process orders directly. However, on every product page, you'll find a verified 'Buy from external seller' button (linking to suppliers like IndiaMART, Moglix, or Amazon). That way, our reviews and ratings remain 100% unbiased!`;
  }

  // 4. Caustic Soda / Chemical Safety / SDS Sheets
  if (/\b(caustic|soda|sds|msds|acid|chemical|hazard|toxic|ph|safety sheet|leak)\b/i.test(clean)) {
    return `Regarding chemical safety: For substances like Caustic Soda (VS-CHM-011) or industrial cleaners, our zero-hallucination policy means hazard classes, ingredients, and required PPE are strictly marked 'Requires manufacturer SDS/label verification'. We never guess formulations. If you need the official manufacturer SDS uploaded, I can flag this right away for our compliance team!`;
  }

  // 5. Gloves / PPE / Protective Gear
  if (/\b(glove|nitrile|latex|hand|en 374|thickness|powder free|cut resist)\b/i.test(clean)) {
    return `We currently track 5 varieties of industrial gloves in our master catalogue: Nitrile, Cotton Knitted, Heavy-Duty Chemical Barrier (EN 374), Black Nitrile, and Dielectric Electrical Insulating Gloves. Are you looking for chemical permeation resistance, puncture protection, or electrical voltage ratings?`;
  }

  // 6. Safety Footwear / Shoes
  if (/\b(shoe|boot|footwear|toe|puncture|steel toe)\b/i.test(clean)) {
    return `Our Safety Shoes master item (VS-PPE-008) includes 200J steel toe impact placeholders pending EN ISO 20345 / IS 15298 confirmation. You can use our side-by-side Compare Matrix to inspect their specifications against cleanroom shoe covers!`;
  }

  // 7. Warehouse / Stock Levels / Inventory Count
  if (/\b(stock|inventory|warehouse|available|units|location|wh-)\b/i.test(clean)) {
    return `Our inventory balances are tracked in real-time between Central Logistics (WH-MAIN-01) and Chemical Vault 2 (WH-CHEM-02). Any adjustments made by staff require an immutable audit trail and mandatory justification reason. Did you need stock checked for a specific item SKU?`;
  }

  // 8. Reviews / Trust / Moderation
  if (/\b(review|rating|fake|moderator|feedback|star)\b/i.test(clean)) {
    return `All reviews submitted to VeriSpec are reviewed by our moderation staff before being published to prevent spam or promotional bias. Only verified safety officers and registered reviewers can publish ratings.`;
  }

  // 9. Comparison Matrix / Specs
  if (/\b(compare|matrix|difference|versus|vs)\b/i.test(clean)) {
    return `You can compare up to 4 products simultaneously on our Compare page! Just head to the Compare tab in the top navigation or click the Compare icon on any product card to see side-by-side technical specs.`;
  }

  // 10. Filing a support ticket or supervisor escalation
  if (/\b(ticket|human|agent|manager|owner|supervisor|escalate|email)\b/i.test(clean)) {
    return `I can immediately log a priority support ticket for our management team! You can also click 'Send Ticket to Portal' right at the top of this chat window anytime, and our staff will review the transcript in the Management portal.`;
  }

  // 11. Polite Conversational Fallback (rotates naturally based on turnCount)
  const fallbacks = [
    `Thanks for explaining. To make sure you get exactly what you need, could you tell me which product or feature you're looking at? I can walk you through the specifications or file a ticket for you.`,
    `Got it! As ${repName}, I'm here to ensure you have accurate, verified safety information. Could you elaborate a bit more on what you'd like to achieve?`,
    `I understand. If you're encountering an issue on the platform or need specific manufacturer documentation, let me know and I'll compile a summary directly for our operations lead.`,
  ];

  return fallbacks[turnCount % fallbacks.length];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], repName = "Elena Rostova", repRole = "Hazardous Materials & SDS Advisor" } = body;

    const userMessages = messages.filter((m: ChatMessage) => m.sender === "user");
    const latestUserMsg = userMessages[userMessages.length - 1]?.text || "";

    const apiKey = process.env.AI_PROVIDER_API_KEY;
    const endpoint = process.env.AI_PROVIDER_ENDPOINT || "https://opencode.ai/zen/v1";
    const model = process.env.AI_PROVIDER_MODEL || "claude-haiku-4-5";
    const isEnabled = process.env.AI_PROVIDER_ENABLED !== "false";

    // Attempt real LLM completion via OpenCode Zen / OpenAI compatible endpoint
    if (apiKey && isEnabled) {
      try {
        const timeoutMs = parseInt(process.env.AI_PROVIDER_TIMEOUT_MS || "8000", 10);
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const systemPrompt = `You are ${repName}, ${repRole} at VeriSpec Industrial & Safety Inventory Platform.
You are chatting live with a customer on the VeriSpec website.
TONE & PERSONALITY:
- Speak warmly, empathetically, and conversationally like a real human specialist (NOT robotic or stiff).
- Keep answers concise and helpful (2 to 4 sentences maximum).
- Never start every reply with the exact same greeting or formula.
- Handle typos naturally (e.g. "isse" = issue, "cna" = can).

VERISPEC DOMAIN RULES:
- VeriSpec is an inventory, product spec, and trusted review platform. It is strictly NOT an e-commerce store (no cart, checkout, or payments). Users buy from verified external sellers using the "Buy from external seller" button.
- We catalogue 19 initial master products (10 PPE items like nitrile gloves, chemical gloves, safety shoes + 9 cleaning/hygiene/waste items like caustic soda, Suma Det., garbage bins).
- Zero hallucination policy: All chemical hazard classes, active ingredients, and PPE certifications are explicitly marked "Requires manufacturer SDS/label verification". Never invent standards or formulas.
- If a user has an issue, offer concrete guidance or offer to file a priority support ticket to our operations team.`;

        const conversationPayload = [
          { role: "system", content: systemPrompt },
          ...messages.slice(-6).map((m: ChatMessage) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        ];

        const aiRes = await fetch(`${endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: conversationPayload,
            max_tokens: 220,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const aiReply = aiData?.choices?.[0]?.message?.content;
          if (aiReply && aiReply.trim()) {
            return NextResponse.json({
              reply: aiReply.trim(),
              source: "opencode_zen_ai",
              model,
            });
          }
        } else {
          const errText = await aiRes.text();
          console.warn(`[AI Chat Provider Warning] Status ${aiRes.status}:`, errText.slice(0, 200));
        }
      } catch (err: unknown) {
        console.warn("[AI Chat Provider Error, falling back to smart engine]:", err instanceof Error ? err.message : String(err));
      }
    }

    // High-intelligence human fallback engine
    const smartReply = generateSmartHumanResponse(latestUserMsg, messages, repName, repRole);

    return NextResponse.json({
      reply: smartReply,
      source: "smart_human_fallback",
      note: apiKey ? "AI provider active; smart conversational fallback utilized" : "AI provider key unconfigured",
    });
  } catch (err: unknown) {
    console.error("[Customer Care API Error]:", err);
    return NextResponse.json(
      {
        reply: "I'm right here with you! Could you describe what you need assistance with, and I'll help you immediately?",
        source: "emergency_fallback",
      },
      { status: 200 }
    );
  }
}
