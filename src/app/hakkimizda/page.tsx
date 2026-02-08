"use client";

import { useEffect, useState } from "react";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import { useRef } from "react";
import type { AboutContent } from "@/lib/types";

export default function HakkimizdaPage() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/site")
      .then((r) => r.json())
      .then((data) => setAbout(data.about))
      .catch(() => setAbout(null));
  }, []);

  useEffect(() => {
    registerGsapPlugins();
    if (!about) return;
    const ctx = gsap.context(() => {
      if (wrapperRef.current) {
        gsap.fromTo(wrapperRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      }
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power2.out" });
      }
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" });
      }
    });
    return () => ctx.revert();
  }, [about]);

  if (!about) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-zinc-500 animate-subtle-pulse">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div ref={wrapperRef} className="glass rounded-2xl border border-white/10 p-8 md:p-12 card-hover">
        <h1 ref={titleRef} className="text-3xl md:text-4xl font-bold text-white mb-6">
          {about.title}
        </h1>
        <div ref={contentRef} className="prose prose-invert prose-zinc max-w-none">
          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
            {about.content}
          </p>
        </div>
      </div>
    </div>
  );
}
