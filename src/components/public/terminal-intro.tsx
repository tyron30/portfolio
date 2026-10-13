"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface Props {
  about: {
    full_name: string;
    role_tag?: string | null;
    headline?: string | null;
    location?: string | null;
    key_skills?: string[] | null;
  } | null;
}

/** Typing terminal that reads like `whoami` for an IT person. All text comes from the About admin page. */
export function TerminalIntro({ about }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  const script = about
    ? [
        { cmd: "whoami", out: about.full_name.toLowerCase() },
        { cmd: "cat role.txt", out: about.role_tag || about.headline || "" },
        { cmd: "echo $LOCATION", out: about.location || "" },
        { cmd: "ls skills/", out: (about.key_skills ?? []).slice(0, 6).join("   ") },
        { cmd: "./status.sh", out: "● open to opportunities" },
      ].filter((l) => l.out)
    : [];

  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"typing" | "out">("typing");

  useEffect(() => {
    if (reduce) setLine(script.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, script.length]);

  useEffect(() => {
    if (!inView || reduce || line >= script.length) return;
    const cur = script[line];
    if (!cur) return;
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      t = chars < cur.cmd.length ? setTimeout(() => setChars((c) => c + 1), 45) : setTimeout(() => setPhase("out"), 250);
    } else {
      t = setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
        setPhase("typing");
      }, 500);
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, line, chars, phase]);

  if (!about || script.length === 0) return null;
  const done = line >= script.length;

  return (
    <section className="container py-16">
      <div ref={ref} className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-primary/10">
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-slate-400">guest@portfolio: ~</span>
        </div>
        <div className="min-h-[15rem] space-y-3 p-5 font-mono text-sm leading-relaxed text-slate-200 sm:p-7 sm:text-base">
          {script.map((l, i) => {
            if (i > line) return null;
            const current = i === line && !done;
            const cmd = current ? l.cmd.slice(0, chars) : l.cmd;
            const showOut = i < line || (current && phase === "out");
            return (
              <div key={l.cmd}>
                <p>
                  <span className="text-emerald-400">$</span> {cmd}
                  {current && phase === "typing" && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-slate-300 align-middle" />}
                </p>
                {showOut && (
                  <p className={`pl-4 ${l.cmd === "./status.sh" ? "text-emerald-400" : "text-sky-300"}`}>{l.out}</p>
                )}
              </div>
            );
          })}
          {done && (
            <p>
              <span className="text-emerald-400">$</span> <span className="inline-block h-4 w-2 animate-pulse bg-slate-300 align-middle" />
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
