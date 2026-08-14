"use client";

import dynamic from "next/dynamic";

// Loaded client-side only, after the main page is interactive — the
// chatbot has no SEO value and pulls in its own JS, so keeping it out of
// the initial server render and main bundle shrinks first-load JS for
// every visitor who never opens it.
//
// This has to live in its own "use client" file: `ssr: false` is only
// allowed inside Client Components, not directly in a Server Component
// like the public layout.
const ChatbotWidget = dynamic(
  () => import("@/components/public/chatbot-widget").then((m) => m.ChatbotWidget),
  { ssr: false }
);

export function ChatbotLoader() {
  return <ChatbotWidget />;
}
