"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Tell me about yourself",
  "What certifications do you have?",
  "What projects have you built?",
  "How can I contact you?",
];

/* ---------- tiny, safe Markdown renderer (no HTML injection) ---------- */

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|mailto:|tel:)[^)\s]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function inline(text: string, key: string) {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    const k = `${key}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={k} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (md) return link(k, md[2] ?? "", md[1] ?? "");
    if (/^https?:\/\//.test(part)) return link(k, part, part.replace(/^https?:\/\//, ""));
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) return link(k, `mailto:${part}`, part);
    return <Fragment key={k}>{part}</Fragment>;
  });
}

function link(key: string, href: string, label: string) {
  return (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words font-medium text-primary underline underline-offset-2"
    >
      {label}
    </a>
  );
}

type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parse(src: string): Block[] {
  const blocks: Block[] = [];
  const push = (type: "ul" | "ol", item: string) => {
    const last = blocks[blocks.length - 1];
    if (last && (last.type === "ul" || last.type === "ol") && last.type === type) last.items.push(item);
    else blocks.push({ type, items: [item] });
  };

  for (const raw of src.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) {
      blocks.push({ type: "p", text: "" }); // paragraph break marker
      continue;
    }
    const ul = line.match(/^[-*•]\s+(.*)$/);
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    const h = line.match(/^#{1,6}\s+(.*)$/);
    if (h) blocks.push({ type: "h", text: h[1] ?? "" });
    else if (ul) push("ul", ul[1] ?? "");
    else if (ol) push("ol", ol[1] ?? "");
    else if ((line.match(/\s-\s/g) ?? []).length >= 3) {
      // Fallback for an inline " - item - item - item" run: turn it into a real list
      const [lead, ...rest] = line.split(/\s-\s/);
      if (lead?.trim()) blocks.push({ type: "p", text: lead.trim() });
      rest.forEach((r) => push("ul", r.trim()));
    } else blocks.push({ type: "p", text: line });
  }
  return blocks;
}

function Markdown({ text }: { text: string }) {
  const blocks = parse(text);
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        const key = `b${i}`;
        if (b.type === "p") return b.text ? <p key={key}>{inline(b.text, key)}</p> : null;
        if (b.type === "h") return <p key={key} className="font-semibold">{inline(b.text, key)}</p>;
        if (b.type === "ul")
          return (
            <ul key={key} className="space-y-1.5">
              {b.items.map((it, n) => (
                <li key={n} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0">{inline(it, `${key}-${n}`)}</span>
                </li>
              ))}
            </ul>
          );
        return (
          <ol key={key} className="space-y-1.5">
            {b.items.map((it, n) => (
              <li key={n} className="flex gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {n + 1}
                </span>
                <span className="min-w-0">{inline(it, `${key}-${n}`)}</span>
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}

/* ---------------------------- widget ---------------------------- */

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const setLast = (content: string) =>
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content };
        return copy;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) {
        setLast((await res.text()) || "Something went wrong.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setLast(accumulated);
      }
    } catch {
      setLast("Connection error. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-500 text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-4 z-50 flex h-[min(600px,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-[26rem] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-300 sm:right-6",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-indigo-500 px-4 py-3.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Portfolio Assistant</p>
            <p className="text-xs text-white/80">Ask me anything about this portfolio</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => !isStreaming && setMessages([])}
              aria-label="Start a new chat"
              title="New chat"
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed shadow-sm">
                Hi! I can tell you about this portfolio: experience, projects, certifications and how to get in touch.
              </div>
              <p className="px-1 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-border bg-card px-3.5 py-2 text-left text-[13px] text-foreground/80 shadow-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[92%] break-words px-4 py-3 text-[13.5px] leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "rounded-2xl rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-2xl rounded-tl-sm border border-border bg-card text-foreground",
                )}
              >
                {msg.role === "assistant" ? (
                  msg.content ? (
                    <Markdown text={msg.content} />
                  ) : (
                    <span className="flex items-center gap-1 py-1" aria-label="Typing">
                      {[0, 1, 2].map((n) => (
                        <span
                          key={n}
                          className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                          style={{ animationDelay: `${n * 0.15}s` }}
                        />
                      ))}
                    </span>
                  )
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 border-t border-border bg-card p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isStreaming}
            className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
