import { buildPortfolioContext } from "@/lib/ai/portfolio-context";
import { isRateLimited } from "@/lib/ai/rate-limit";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTIONS = `You are the AI assistant embedded on this portfolio website. Your ONLY job is to answer
visitor questions about the portfolio owner using the PORTFOLIO CONTEXT provided below.

CRITICAL RULES:
1. When a visitor uses "you" or "your" (e.g. "what is your name", "what are your skills",
   "where do you work"), they mean the PORTFOLIO OWNER, not you the assistant. Answer using
   the owner's actual name/info from the context — e.g. "My name is Tyron Del Valle" or
   "I'm an IT Specialist based in Tacloban City" — speaking as if you are presenting the
   owner's information directly and personally, sourced only from the context below.
2. Only clarify that you are an AI assistant (not the person themselves) if the visitor
   explicitly asks something like "are you a real person" or "are you an AI/bot".
3. Answer STRICTLY from the PORTFOLIO CONTEXT below. Never use general knowledge, invent
   facts, or answer questions unrelated to this portfolio (e.g. coding help, trivia, other
   people, current events). If asked something outside the context or unrelated to the
   portfolio, politely say you can only answer questions about this portfolio and suggest
   they use the contact form for anything else.
4. Never invent projects, dates, certifications, or contact details that aren't in the
   context. If the context doesn't cover something, say so plainly rather than guessing.
5. Be friendly and concise. If asked to "download the resume", point to the resume link
   from the context.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response("Too many requests — please wait a moment before asking again.", { status: 429 });
  }

  if (!process.env.GROQ_API_KEY) {
    return new Response(
      "The chatbot isn't configured yet — add GROQ_API_KEY to your environment variables. Get a free key at https://console.groq.com/keys",
      { status: 503 }
    );
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("No message provided.", { status: 400 });
  }

  const context = await buildPortfolioContext();

  // Groq's API is OpenAI-compatible (same request/response shape and SSE
  // streaming format), so only the base URL, auth env var, and model name
  // differ from an OpenAI setup. Free tier, no credit card required.
  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      stream: true,
      temperature: 0.4,
      messages: [
        { role: "system", content: `${SYSTEM_INSTRUCTIONS}\n\nPORTFOLIO CONTEXT:\n${context}` },
        ...messages.slice(-10), // keep the last few turns only
      ],
    }),
  });

  if (!groqRes.ok || !groqRes.body) {
    console.error("Groq API error:", groqRes.status);
    return new Response(
      "The chatbot is temporarily unavailable. Please try again shortly.",
      { status: 502 }
    );
  }

  // Translate the SSE stream into a plain text stream of content deltas,
  // so the client can just read the response body directly.
  const reader = groqRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta: string | undefined = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore malformed keep-alive chunks
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}



