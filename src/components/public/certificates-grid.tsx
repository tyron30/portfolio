"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, Download, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  image_url?: string | null;
  pdf_url?: string | null;
  issue_date?: string | null;
}

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long" }) : "";

export function CertificatesGrid({ certificates }: { certificates: Certificate[] }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [dir, setDir] = useState(1);
  const [stageW, setStageW] = useState(360);

  const stage = useRef<HTMLDivElement>(null);
  const panned = useRef(false);

  const issuers = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach((c) => set.add(c.issuer));
    return ["All", ...Array.from(set)];
  }, [certificates]);

  const list = useMemo(
    () => (filter === "All" ? certificates : certificates.filter((c) => c.issuer === filter)),
    [certificates, filter],
  );
  const n = list.length;
  const cur = list[active];

  // Measure stage so card size / spacing are exact at any breakpoint
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    setStageW(el.clientWidth);
    return () => ro.disconnect();
  }, [n]);

  const cardW = Math.min(stageW * 0.72, 440);
  const cardH = cardW * 0.75;
  const gap = cardW * (stageW < 640 ? 0.62 : 0.66);

  const move = useCallback(
    (d: number) => {
      if (n === 0) return;
      setDir(d > 0 ? 1 : -1);
      setActive((a) => (a + d + n) % n);
    },
    [n],
  );

  const pick = (i: number) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  // Shortest signed distance on a loop
  const offsetOf = (i: number) => {
    let off = i - active;
    if (n > 2) {
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
    }
    return off;
  };

  // Keyboard inside the lightbox
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, move]);

  return (
    <section id="certificates" className="relative overflow-hidden py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Certificates <span className="text-gradient">& Credentials</span>
        </h2>

        {n === 0 && certificates.length === 0 ? (
          <p className="mt-8 text-center text-muted-foreground">No certificates added yet.</p>
        ) : (
          <>
            {/* Filter chips */}
            {issuers.length > 2 && (
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {issuers.map((name) => {
                  const on = filter === name;
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        setFilter(name);
                        setActive(0);
                      }}
                      className="relative rounded-full px-4 py-1.5 text-sm font-medium"
                    >
                      {on && (
                        <motion.span
                          layoutId="cert-chip"
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span className={`relative ${on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                        {name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Ambient glow = blurred copy of the centered certificate */}
            <div className="pointer-events-none absolute inset-x-0 top-40 -z-10 h-[28rem] overflow-hidden" aria-hidden>
              <AnimatePresence>
                {cur?.image_url && (
                  <motion.div
                    key={cur.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <Image src={cur.image_url} alt="" fill className="scale-125 object-cover blur-3xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Coverflow stage */}
            <div className="relative mt-12">
              <motion.div
                ref={stage}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") move(1);
                  if (e.key === "ArrowLeft") move(-1);
                  if (e.key === "Enter" && cur) setOpen(true);
                }}
                onPanStart={() => (panned.current = true)}
                onPanEnd={(_, info) => {
                  if (info.offset.x < -50 || info.velocity.x < -400) move(1);
                  else if (info.offset.x > 50 || info.velocity.x > 400) move(-1);
                  setTimeout(() => (panned.current = false), 50);
                }}
                className="relative mx-auto w-full max-w-5xl outline-none"
                style={{ height: cardH + 24, perspective: 1400, touchAction: "pan-y" }}
              >
                {list.map((cert, i) => {
                  const off = offsetOf(i);
                  const abs = Math.abs(off);
                  const visible = abs <= 2;
                  const isCenter = off === 0;
                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, scale: 0.6, x: 0 }}
                      animate={{
                        x: off * gap,
                        scale: isCenter ? 1.08 : Math.max(0.62, 0.84 - (abs - 1) * 0.12),
                        rotateY: Math.max(-45, Math.min(45, -off * 28)),
                        opacity: visible ? (isCenter ? 1 : 0.62 - (abs - 1) * 0.22) : 0,
                        filter: isCenter ? "blur(0px) brightness(1)" : `blur(${abs * 1.2}px) brightness(0.9)`,
                      }}
                      transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.9 }}
                      onClick={() => {
                        if (panned.current) return;
                        if (isCenter) setOpen(true);
                        else pick(i);
                      }}
                      className="absolute left-1/2 top-3 cursor-pointer"
                      style={{
                        width: cardW,
                        height: cardH,
                        marginLeft: -cardW / 2,
                        zIndex: 20 - abs,
                        pointerEvents: visible ? "auto" : "none",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* idle float on the active card only */}
                      <motion.div
                        animate={isCenter ? { y: [0, -7, 0] } : { y: 0 }}
                        transition={isCenter ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                        className={`group relative h-full w-full overflow-hidden rounded-2xl border bg-card transition-shadow duration-500 ${
                          isCenter
                            ? "border-primary/40 shadow-[0_30px_60px_-20px_hsl(var(--primary)/0.55)]"
                            : "border-border shadow-md"
                        }`}
                      >
                        {cert.image_url ? (
                          <Image
                            src={cert.image_url}
                            alt={cert.title}
                            fill
                            draggable={false}
                            sizes="(max-width: 640px) 80vw, 460px"
                            className="select-none object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <Award className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}

                        {/* Shine sweep every time a card arrives in the center */}
                        {isCenter && (
                          <motion.span
                            key={`shine-${cert.id}`}
                            initial={{ x: "-120%" }}
                            animate={{ x: "320%" }}
                            transition={{ duration: 1.1, delay: 0.25, ease: "easeInOut" }}
                            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                          />
                        )}

                        {/* Hint on hover */}
                        {isCenter && (
                          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                            <Expand className="h-3.5 w-3.5" /> View
                          </span>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Arrows */}
              {n > 1 && (
                <>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => move(-1)}
                    aria-label="Previous certificate"
                    className="absolute left-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground sm:left-6"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => move(1)}
                    aria-label="Next certificate"
                    className="absolute right-2 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground sm:right-6"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Caption for the centered certificate */}
            <div className="mx-auto mt-6 min-h-[8rem] max-w-xl text-center">
              <AnimatePresence mode="wait" initial={false}>
                {cur && (
                  <motion.div
                    key={cur.id}
                    initial={{ opacity: 0, y: 14 * dir, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14 * dir, filter: "blur(4px)" }}
                    transition={{ duration: 0.28 }}
                  >
                    <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      {cur.issuer}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold leading-snug sm:text-2xl">{cur.title}</h3>
                    {cur.issue_date && <p className="mt-1 text-sm text-muted-foreground">{fmt(cur.issue_date)}</p>}
                    <div className="mt-4 flex justify-center gap-3">
                      <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
                      >
                        <Expand className="h-4 w-4" /> View
                      </button>
                      {cur.pdf_url && (
                        <a
                          href={cur.pdf_url}
                          download
                          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          <Download className="h-4 w-4" /> PDF
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Counter + progress */}
            {n > 1 && (
              <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-sky-400"
                    animate={{ width: `${((active + 1) / n) * 100}%` }}
                    transition={{ type: "spring", stiffness: 160, damping: 24 }}
                  />
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{String(n).padStart(2, "0")}</span>
              </div>
            )}
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Swipe or use the arrows · click the center card to enlarge
            </p>
          </>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{cur?.title}</DialogTitle>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
            <AnimatePresence initial={false} mode="popLayout">
              {cur?.image_url && (
                <motion.div
                  key={cur.id}
                  initial={{ opacity: 0, x: dir * 60, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: dir * -60, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image src={cur.image_url} alt={cur.title} fill className="object-contain" />
                </motion.div>
              )}
            </AnimatePresence>
            {n > 1 && (
              <>
                <button
                  onClick={() => move(-1)}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 shadow backdrop-blur transition hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => move(1)}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 shadow backdrop-blur transition hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{cur?.issuer}</p>
              <p className="text-xs text-muted-foreground">
                {fmt(cur?.issue_date)} · {active + 1} of {n}
              </p>
            </div>
            {cur?.pdf_url && (
              <a
                href={cur.pdf_url}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
