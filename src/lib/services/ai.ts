export interface AiDraftSuggestion {
  isAiGenerated: true;
  status: "DRAFT_REQUIRES_OWNER_APPROVAL";
  promptType: "DRAFT_SUMMARY" | "SUGGEST_SYNONYMS" | "MODERATION_ASSIST";
  output: string;
  sourceAttribution: string;
  disclaimer: string;
}

export async function generateAiDraftSuggestion(
  productName: string,
  category: string,
  knownDescription: string,
  promptType: "DRAFT_SUMMARY" | "SUGGEST_SYNONYMS" | "MODERATION_ASSIST"
): Promise<AiDraftSuggestion> {
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  const isEnabled = process.env.AI_PROVIDER_ENABLED === "true";

  // Strict rule: Never expose API key or invent claims. If disabled or no key, return controlled draft template
  if (!apiKey || !isEnabled) {
    let mockDraft = "";
    if (promptType === "DRAFT_SUMMARY") {
      mockDraft = `[AI-Draft Suggestion for ${productName} in ${category}]: Designed for general industrial handling. All safety claims, certifications, and compliance standards must be verified against official manufacturer documentation before publishing.`;
    } else if (promptType === "SUGGEST_SYNONYMS") {
      mockDraft = `[AI-Draft Synonyms]: ${productName.toLowerCase()}, industrial ${category.toLowerCase()} gear, workplace protection`;
    } else {
      mockDraft = `[AI Moderation Signal]: Flagged 0 prohibited terms. Pending human moderator approval.`;
    }

    return {
      isAiGenerated: true,
      status: "DRAFT_REQUIRES_OWNER_APPROVAL",
      promptType,
      output: mockDraft,
      sourceAttribution: "Server AI Adapter (Simulated / Key Unconfigured)",
      disclaimer:
        "AI output is an unverified draft for administrative assistance only. Management or Owner verification is strictly required before publication.",
    };
  }

  // If a real server-side key is configured by the owner in environment, call the endpoint securely
  try {
    const endpoint = process.env.AI_PROVIDER_ENDPOINT || "https://api.openai.com/v1";
    const model = process.env.AI_PROVIDER_MODEL || "gpt-4o-mini";
    const timeoutMs = parseInt(process.env.AI_PROVIDER_TIMEOUT_MS || "15000", 10);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const promptText = `Generate a neutral, objective draft summary for an industrial item named "${productName}" in category "${category}". Known context: "${knownDescription}".
CRITICAL CONSTRAINT: Do NOT invent standards, certifications, medical/disinfection claims, prices, chemical formulations, or hazard classes. State clearly that specifications require official documentation.`;

    const res = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: promptText }],
        max_tokens: 250,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`AI Provider returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content || "No draft generated.";

    return {
      isAiGenerated: true,
      status: "DRAFT_REQUIRES_OWNER_APPROVAL",
      promptType,
      output: content,
      sourceAttribution: `Server AI Adapter (${model})`,
      disclaimer:
        "AI output is an unverified draft. Owner approval is mandatory before any fact is published.",
    };
  } catch (err: unknown) {
    console.error("[AI Adapter Error]:", err instanceof Error ? err.message : String(err));
    return {
      isAiGenerated: true,
      status: "DRAFT_REQUIRES_OWNER_APPROVAL",
      promptType,
      output: `[Fallback Draft]: Specifications for ${productName} require manufacturer documentation.`,
      sourceAttribution: "Safe Fallback Adapter",
      disclaimer: "AI service failed gracefully. No facts were invented.",
    };
  }
}
