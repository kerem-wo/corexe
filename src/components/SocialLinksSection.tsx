"use client";

import { useRef, useEffect } from "react";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import type { SocialLink } from "@/lib/types";

interface SocialLinksSectionProps {
  links: SocialLink[];
}

export default function SocialLinksSection({ links }: SocialLinksSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const sorted = [...links].sort((a, b) => a.order - b.order);

  useEffect(() => {
    registerGsapPlugins();
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      }
      linkRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: i * 0.08,
            ease: "back.out(1.2)",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [sorted.length]);

  if (sorted.length === 0) return null;

  return (
    <section id="sosyal-medya" ref={sectionRef} className="scroll-mt-24">
      <h2 ref={titleRef} className="text-3xl font-bold text-white mb-2">Sosyal Medya</h2>
      <p className="text-zinc-400 mb-8">Bizi takip edin, destek olun.</p>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {sorted.map((link, i) => (
          <a
            key={link.id}
            ref={(r) => { linkRefs.current[i] = r; }}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl glass border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98] group card-hover"
          >
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-bold text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all duration-300">
              {link.platform.charAt(0)}
            </span>
            <span className="font-semibold text-white">{link.platform}</span>
            <svg className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}
