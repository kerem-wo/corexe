"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import type { SliderItem } from "@/lib/types";

interface HeroSliderProps {
  sliders: SliderItem[];
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const sorted = [...sliders].sort((a, b) => a.order - b.order);

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    if (sorted.length === 0) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % sorted.length);
    }, 5000);
    return () => clearInterval(t);
  }, [sorted.length]);

  useEffect(() => {
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === current ? 1 : 0,
        scale: i === current ? 1 : 1.03,
        duration: 1,
        ease: "power2.inOut",
        overwrite: true,
      });
    });
    textRefs.current.forEach((el, i) => {
      if (!el || i !== current) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power3.out" }
      );
    });
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out" });
    }
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      gsap.to(dot, { scale: i === current ? 1.2 : 1, duration: 0.3, ease: "power2.out" });
    });
  }, [current]);

  if (sorted.length === 0) return null;

  return (
    <section ref={containerRef} className="relative h-[420px] md:h-[520px] overflow-hidden rounded-2xl">
      {sorted.map((slide, i) => (
        <div
          key={slide.id}
          ref={(r) => { slideRefs.current[i] = r; }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-out"
            style={{
              backgroundImage: slide.image ? `url(${slide.image})` : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
              backgroundSize: "cover",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div ref={(r) => { textRefs.current[i] = r; }} className="max-w-xl">
              <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">
                {slide.subtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {slide.title}
              </h2>
              <p className="text-zinc-300 text-lg mb-6">{slide.description}</p>
              <Link
                ref={i === current ? ctaRef : undefined}
                href={slide.link}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] btn-interactive"
              >
                İncele
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
      {sorted.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
          {sorted.map((_, i) => (
            <button
              key={i}
              ref={(r) => { dotRefs.current[i] = r; }}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
                i === current ? "bg-emerald-500 w-8 shadow-lg shadow-emerald-500/40" : "bg-white/40 hover:bg-white/70 w-2.5"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
