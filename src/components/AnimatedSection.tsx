"use client";

import { useRef, useEffect, ReactNode } from "react";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
  y?: number;
  opacity?: number;
  once?: boolean;
}

export default function AnimatedSection({
  children,
  id,
  className = "",
  delay = 0,
  y = 40,
  opacity = 0,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [opacity, y, delay, once]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
