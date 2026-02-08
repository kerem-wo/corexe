"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import type { DiscountBanner } from "@/lib/types";

interface DiscountBannersProps {
  banners: DiscountBanner[];
}

export default function DiscountBanners({ banners }: DiscountBannersProps) {
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const sorted = [...banners].sort((a, b) => a.order - b.order);

  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [sorted.length]);

  if (sorted.length === 0) return null;

  return (
    <section ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sorted.map((banner, i) => (
        <Link
          key={banner.id}
          href={banner.link}
          ref={(r) => { refs.current[i] = r; }}
          className="group relative overflow-hidden rounded-2xl glass border border-white/10 hover:border-emerald-500/40 transition-all duration-500 flex items-center gap-4 p-6 card-hover"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700 ease-out"
            style={{ backgroundImage: banner.image ? `url(${banner.image})` : "linear-gradient(135deg, #14532d 0%, #166534 100%)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
          <div className="relative flex items-center gap-4 w-full">
            <span className="text-3xl md:text-4xl font-black text-emerald-400 transition-transform duration-300 group-hover:scale-110">
              {banner.discount}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{banner.title}</h3>
              <p className="text-sm text-zinc-400">{banner.subtitle}</p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
