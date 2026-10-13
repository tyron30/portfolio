"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Camera, Globe, Monitor, Network, Server, Share2, Wifi, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/public/section-header";

interface Node { id: string; label: string; x: number; y: number; Icon: LucideIcon; title: string; desc: string }

// Edit the text below to change what each device says.
const NODES: Node[] = [
  { id: "wan", label: "Internet", x: 135, y: 255, Icon: Globe, title: "Internet / WAN", desc: "ISP connections, WAN links and connectivity troubleshooting, keeping offices online." },
  { id: "router", label: "Router", x: 315, y: 255, Icon: Network, title: "Router & Security", desc: "Router configuration, IP addressing and basic network security. TP-Link certified (OCNA, VCSA)." },
  { id: "switch", label: "Switch", x: 495, y: 255, Icon: Share2, title: "LAN & Switching", desc: "LAN setup and maintenance: cabling, switches and keeping the local network reliable." },
  { id: "pc", label: "Workstations", x: 765, y: 60, Icon: Monitor, title: "Workstations & Users", desc: "Windows and Linux setup, system deployment, troubleshooting and day-to-day user support." },
  { id: "server", label: "Servers / VMs", x: 765, y: 190, Icon: Server, title: "Servers & Virtualization", desc: "Virtual machines with VMware and Hyper-V, plus remote support with AnyDesk and TeamViewer." },
  { id: "cctv", label: "CCTV", x: 765, y: 320, Icon: Camera, title: "CCTV & Surveillance", desc: "Camera planning, installation and DVR/NVR configuration." },
  { id: "ap", label: "Wi-Fi", x: 765, y: 450, Icon: Wifi, title: "Wireless Access", desc: "Access point setup, wireless coverage and connection troubleshooting." },
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;
const line = (a: string, b: string) => `M${byId(a).x},${byId(a).y} L${byId(b).x},${byId(b).y}`;
const curve = (a: string, b: string) => {
  const p = byId(a), q = byId(b);
  return `M${p.x},${p.y} C${p.x + 120},${p.y} ${q.x - 120},${q.y} ${q.x},${q.y}`;
};
const EDGES = [
  line("wan", "router"), line("router", "switch"),
  curve("switch", "pc"), curve("switch", "server"), curve("switch", "cctv"), curve("switch", "ap"),
];

export function NetworkDiagram() {
  const [active, setActive] = useState("router");
  const cur = byId(active);

  // iOS Safari can't observe SVG elements with IntersectionObserver, so whileInView never fires there.
  // Watch the HTML wrapper instead, with a timed fallback so the diagram always appears.
  const wrap = useRef<HTMLDivElement>(null);
  const seen = useInView(wrap, { once: true, amount: 0.15 });
  const [late, setLate] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLate(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const show = seen || late;

  return (
    <section id="network" className="container py-24">
      <SectionHeader eyebrow="How I work" title={<>The Network I <span className="text-gradient">Keep Running</span></>} subtitle="From the internet line to the last camera. Hover or tap a device." />

      <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-8">
        <div ref={wrap} className="bg-dots rounded-2xl">
          <svg viewBox="0 0 900 520" className="h-auto w-full" role="img" aria-label="Network diagram">
            {EDGES.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                className="fill-none stroke-border"
                strokeWidth={3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12 }}
              />
            ))}
            {EDGES.map((d, i) => (
              <circle key={`p-${d}`} r={5} className="fill-primary">
                <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
              </circle>
            ))}

            {NODES.map((n, i) => {
              const on = n.id === active;
              return (
                <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                  <motion.g
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ cursor: "pointer", transformBox: "fill-box", transformOrigin: "center" }}
                    onMouseEnter={() => setActive(n.id)}
                    onFocus={() => setActive(n.id)}
                    onClick={() => setActive(n.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={n.title}
                  >
                    {on && (
                      <circle r={38} className="fill-none stroke-primary">
                        <animate attributeName="r" values="38;58" dur="1.6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle r={38} className={`fill-card ${on ? "stroke-primary" : "stroke-border"}`} strokeWidth={on ? 3 : 2} />
                    <n.Icon x={-17} y={-17} width={34} height={34} strokeWidth={1.8} className={on ? "text-primary" : "text-foreground/70"} />
                    <text y={62} textAnchor="middle" className="fill-foreground" style={{ fontSize: 24, fontWeight: 600 }}>
                      {n.label}
                    </text>
                  </motion.g>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-6 min-h-[5.5rem] rounded-2xl bg-muted/60 p-5">
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <h3 className="flex items-center gap-2 font-semibold">
                <cur.Icon className="h-5 w-5 text-primary" /> {cur.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{cur.desc}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
