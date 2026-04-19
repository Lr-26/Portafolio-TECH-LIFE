import { NextResponse } from "next/server";
import { getNeuralResponse } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    // 1. Precise current message extraction
    const userMessages = messages.filter((m: any) => m.type === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.text;
    
    if (!lastUserMessage) {
      return NextResponse.json({ error: "Empty signal" }, { status: 400 });
    }

    // 2. Build history strictly for PREVIOUS messages (must be User/Model pairs)
    // We slice(0, -1) to remove the current user message from history
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.type === 'bot' ? 'model' as const : 'user' as const,
      parts: [{ text: m.text }]
    }));

    // Ensure strictly valid history sequence: user, model, user, model...
    if (history.length > 0 && history[0].role === 'model') history = history.slice(1);
    if (history.length > 0 && history[history.length - 1].role === 'user') history = history.slice(0, -1);

    const responseText = await getNeuralResponse(history, lastUserMessage);

    return NextResponse.json({ 
      text: responseText 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Neural link interrupted" }, { status: 500 });
  }
}
