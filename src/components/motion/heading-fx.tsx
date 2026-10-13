"use client";

import { useEffect } from "react";

/** Draws an animated accent underline under every large section heading as it scrolls into view. */
export function HeadingFX() {
  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLElement>("main h2")).filter(
      (h) => parseFloat(getComputedStyle(h).fontSize) >= 26,
    );
    if (!("IntersectionObserver" in window)) {
      heads.forEach((h) => h.setAttribute("data-fx", "in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-fx", "in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.6 },
    );
    heads.forEach((h) => {
      h.setAttribute("data-fx", "out");
      io.observe(h);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
