import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { apiKey, endpoint = "https://opencode.ai/zen/v1", model = "claude-haiku-4-5" } = await req.json();

    const keyToTest = apiKey || process.env.AI_PROVIDER_API_KEY;

    if (!keyToTest) {
      return NextResponse.json({
        success: false,
        message: "No API key provided or found in environment.",
      });
    }

    // 1. First test models list
    const modelsRes = await fetch(`${endpoint}/models`, {
      headers: { Authorization: `Bearer ${keyToTest}` },
    });

    if (!modelsRes.ok) {
      const errText = await modelsRes.text();
      return NextResponse.json({
        success: false,
        message: `Endpoint returned HTTP ${modelsRes.status}: ${errText.slice(0, 160)}`,
      });
    }

    const modelsData = await modelsRes.json();
    const modelCount = modelsData?.data?.length || 0;

    // 2. Test chat completions
    const chatRes = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyToTest}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "Hello from VeriSpec diagnostic test" }],
        max_tokens: 30,
      }),
    });

    if (!chatRes.ok) {
      const chatErr = await chatRes.text();
      let parsedErr = chatErr;
      try {
        const j = JSON.parse(chatErr);
        if (j.error?.message) parsedErr = j.error.message;
      } catch {}

      return NextResponse.json({
        success: false,
        modelsFound: modelCount,
        message: `Authentication valid (${modelCount} models detected on OpenCode Zen), but Chat Completion returned: ${parsedErr}`,
      });
    }

    const chatData = await chatRes.json();
    const replySnippet = chatData?.choices?.[0]?.message?.content || "OK";

    return NextResponse.json({
      success: true,
      modelsFound: modelCount,
      message: `✓ Connection established! Detected ${modelCount} models on ${endpoint}. Sample response: "${replySnippet.trim()}"`,
    });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      message: `Connection failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
