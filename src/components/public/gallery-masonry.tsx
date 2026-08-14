"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";

interface GalleryItem {
  id: string;
  image_url: string;
  caption?: string | null;
  category?: string | null;
}

export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))],
    [items]
  );

  const filtered = activeCategory === "all" ? items : items.filter((i) => i.category === activeCategory);
  const lightboxImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const close = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );

  // Keyboard navigation while the lightbox is open: ← → to browse, Esc to close.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, close, showPrev, showNext]);

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="container py-24">
      <Reveal>
        <h2 className="text-center text-3xl font-bold sm:text-4xl">
          Training &amp; Events <span className="text-gradient">Gallery</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Photo evidence from trainings, certifications, seminars, and community work — documenting the roles and
          activities listed above.
        </p>
      </Reveal>

      {categories.length > 2 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxIndex(null);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm capitalize transition-colors",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Uniform grid (not masonry) — reads as a documented record/evidence
          set rather than a casual photo scrapbook. */}
      <StaggerContainer className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item, i) => (
          <StaggerItem key={item.id}>
            <button
              onClick={() => setLightboxIndex(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={item.image_url}
                alt={item.caption ?? "Gallery photo"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay: dark gradient + caption/category text + expand icon */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.caption && (
                  <p className="text-left text-sm font-semibold leading-snug text-white">{item.caption}</p>
                )}
                {item.category && (
                  <p className="mt-0.5 text-left text-xs capitalize text-white/70">{item.category}</p>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
            </button>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={close}
          >
            <button
              className="absolute right-4 top-4 text-white/80 hover:text-white"
              onClick={close}
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white sm:left-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white sm:right-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            <motion.div
              key={lightboxImage.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxImage.image_url}
                alt={lightboxImage.caption ?? "Gallery photo"}
                width={1200}
                height={1200}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
              {lightboxImage.caption && (
                <p className="mt-2 text-center text-sm text-white/80">{lightboxImage.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
