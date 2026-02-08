"use client";

import Link from "next/link";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef, useEffect } from "react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linksRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = footerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", end: "bottom 8%", toggleActions: "play none none none" },
        }
      );
      colRefs.current.forEach((col, i) => {
        if (!col) return;
        gsap.fromTo(col, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 + i * 0.1, ease: "power2.out", scrollTrigger: { trigger: col, start: "top 95%", toggleActions: "play none none none" } });
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="glass-strong border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div ref={(r) => { colRefs.current[0] = r; }}>
            <h3 className="text-lg font-semibold text-white mb-4">COREXE BEST</h3>
            <p className="text-sm text-zinc-400">
              Oyun hesapları, UC satışı ve sosyal medya hizmetleri.
            </p>
          </div>
          <div ref={(r) => { colRefs.current[1] = r; }}>
            <h3 className="text-lg font-semibold text-white mb-4">Bağlantılar</h3>
            <ul ref={linksRef} className="space-y-2">
              {[
                { href: "/", label: "Ana Sayfa" },
                { href: "/#urunler", label: "Hesaplar" },
                { href: "/#uc", label: "UC Satışları" },
                { href: "/#sosyal-medya", label: "Sosyal Medya" },
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/iletisim", label: "İletişim" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors duration-300 inline-block hover:translate-x-1">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div ref={(r) => { colRefs.current[2] = r; }}>
            <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
            <p className="text-sm text-zinc-400">WhatsApp ile 7/24 destek.</p>
            <a
              href="https://wa.me/905527374558"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-all duration-300 hover:translate-x-1"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} COREXE BEST. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
