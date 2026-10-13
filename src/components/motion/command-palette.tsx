"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp } from "lucide-react";

const CANDIDATES = [
  "home", "about", "experience", "education", "projects", "certificates",
  "seminars", "tech-stack", "skills", "gallery", "contact",
];

const pretty = (id: string) =>
  id.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");

type Item = { id: string; label: string; run: () => void };

/** Ctrl/Cmd + K (or "/") quick navigation. Only lists sections that exist on the page. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const input = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    setQ("");
    setIdx(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const found: Item[] = CANDIDATES.filter((id) => document.getElementById(id)).map((id) => ({
      id,
      label: pretty(id),
      run: () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    }));
    found.unshift({
      id: "top",
      label: "Back to top",
      run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    });
    setItems(found);
    setTimeout(() => input.current?.focus(), 30);
  }, [open]);

  const list = useMemo(
    () => items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );

  const go = (i?: Item) => {
    if (!i) return;
    close();
    setTimeout(i.run, 120);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open quick navigation"
        className="glass fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-xs text-muted-foreground shadow-lg md:flex"
      >
        <Search className="h-3.5 w-3.5" />
        Quick nav
        <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-sans text-[10px]">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex items-start justify-center bg-slate-950/50 px-4 pt-[18vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-label="Quick navigation"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -16, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setIdx(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setIdx((i) => Math.min(i + 1, list.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setIdx((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter") {
                      go(list[idx]);
                    }
                  }}
                  placeholder="Jump to a section…"
                  className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <ul className="max-h-72 overflow-auto p-2">
                {list.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-muted-foreground">No match</li>
                )}
                {list.map((i, n) => (
                  <li key={i.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setIdx(n)}
                      onClick={() => go(i)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        n === idx ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {i.id === "top" && <ArrowUp className="h-3.5 w-3.5" />}
                        {i.label}
                      </span>
                      {n === idx && <CornerDownLeft className="h-3.5 w-3.5 opacity-80" />}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
