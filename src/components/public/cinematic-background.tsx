"use client";

import { useEffect, useRef } from "react";

interface Particle { x: number; y: number; vx: number; vy: number; r: number; z: number }
interface TechNode { x: number; y: number; vx: number; vy: number; size: number; rot: number; vr: number; z: number; phase: number }

/**
 * Dark "cinematic" hero backdrop: deep navy gradient, soft light beams, and a canvas of
 * drifting cyan particles joined by faint lines plus glowing hexagon nodes. Reacts to the
 * mouse with depth-based parallax, pauses when off-screen or the tab is hidden, uses far
 * fewer particles on phones, and draws a single still frame for reduced-motion visitors.
 */
export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let onScreen = true;
    let tabVisible = !document.hidden;
    let targetX = 0;
    let targetY = 0;
    let px = 0;
    let py = 0;
    let parts: Particle[] = [];
    let nodes: TechNode[] = [];
    let maxDist = 110;
    const root = document.documentElement;
    let light = !root.classList.contains("dark");

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const small = w < 640;
      maxDist = small ? 80 : 120;
      const pCount = small ? 30 : Math.min(90, Math.floor(w / 15));
      const nCount = small ? 4 : 8;

      parts = Array.from({ length: pCount }, () => ({
        x: rand(0, w), y: rand(0, h), vx: rand(-0.22, 0.22), vy: rand(-0.22, 0.22), r: rand(0.7, 2.1), z: rand(0.15, 1),
      }));
      nodes = Array.from({ length: nCount }, () => ({
        x: rand(0, w), y: rand(0, h), vx: rand(-0.12, 0.12), vy: rand(-0.12, 0.12),
        size: rand(10, small ? 18 : 28), rot: rand(0, Math.PI), vr: rand(-0.004, 0.004), z: rand(0.3, 1), phase: rand(0, 6.28),
      }));
    };

    const hex = (cx: number, cy: number, size: number, rot: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = rot + (Math.PI / 3) * i;
        const x = cx + Math.cos(a) * size;
        const y = cy + Math.sin(a) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      px += (targetX - px) * 0.06;
      py += (targetY - py) * 0.06;

      // connecting lines
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i]!;
        const ax = a.x + px * 40 * a.z;
        const ay = a.y + py * 28 * a.z;
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j]!;
          const bx = b.x + px * 40 * b.z;
          const by = b.y + py * 28 * b.z;
          const dx = ax - bx;
          const dy = ay - by;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            ctx.strokeStyle = light
              ? `rgba(37,99,235,${(1 - d / maxDist) * 0.25})`
              : `rgba(56,189,248,${(1 - d / maxDist) * 0.2})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of parts) {
        const x = p.x + px * 40 * p.z;
        const y = p.y + py * 28 * p.z;
        ctx.fillStyle = light ? `rgba(37,99,235,${0.2 + p.z * 0.4})` : `rgba(103,232,249,${0.25 + p.z * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r * (0.6 + p.z * 0.7), 0, Math.PI * 2);
        ctx.fill();
        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = w + 10;
          else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          else if (p.y > h + 10) p.y = -10;
        }
      }

      // glowing hexagon nodes
      for (const n of nodes) {
        const bob = Math.sin(t / 1400 + n.phase) * 6;
        const x = n.x + px * 70 * n.z;
        const y = n.y + py * 48 * n.z + bob;
        ctx.save();
        ctx.shadowColor = light ? "rgba(59,130,246,0.45)" : "rgba(34,211,238,0.9)";
        ctx.shadowBlur = (light ? 8 : 16) * n.z;
        ctx.strokeStyle = light ? `rgba(37,99,235,${0.3 + n.z * 0.35})` : `rgba(103,232,249,${0.35 + n.z * 0.4})`;
        ctx.fillStyle = light ? "rgba(37,99,235,0.06)" : "rgba(34,211,238,0.07)";
        ctx.lineWidth = 1.4;
        hex(x, y, n.size * (0.7 + n.z * 0.5), n.rot);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          n.rot += n.vr;
          if (n.x < -40) n.x = w + 40;
          else if (n.x > w + 40) n.x = -40;
          if (n.y < -40) n.y = h + 40;
          else if (n.y > h + 40) n.y = -40;
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !onScreen || !tabVisible) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };
    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) start();
      else stop();
    };

    setup();
    draw(0);
    start();

    const ro = new ResizeObserver(() => {
      setup();
      draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);

    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    // follow the dark/light toggle
    const mo = new MutationObserver(() => {
      light = !root.classList.contains("dark");
      draw(0);
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,var(--fx-a)_0%,var(--fx-b)_50%,var(--fx-c)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.8)_1px,transparent_0)] bg-[length:36px_36px] opacity-[0.07]" />
      <div className="absolute -left-1/4 top-0 h-[70%] w-1/2 rotate-12 bg-gradient-to-b from-cyan-400/15 via-transparent to-transparent blur-3xl" />
      <div className="absolute -right-1/4 top-0 h-[70%] w-1/2 -rotate-12 bg-gradient-to-b from-blue-500/20 via-transparent to-transparent blur-3xl" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
