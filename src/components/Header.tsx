"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import { useRef, useEffect } from "react";

const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/#urunler", label: "Hesaplar" },
  { href: "/#uc", label: "UC Satışları" },
  { href: "/#sosyal-medya", label: "Sosyal Medya" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const cartRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
    navRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.2 + i * 0.05, ease: "power2.out" });
    });
    if (cartRef.current) {
      gsap.fromTo(cartRef.current, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.5, ease: "power2.out" });
    }
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link
            ref={logoRef}
            href="/"
            className="text-xl font-bold text-white tracking-tight transition-transform duration-300 hover:scale-105 active:scale-100"
          >
            COREXE BEST
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {nav.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                ref={(r) => { navRefs.current[i] = r; }}
                className={`relative text-sm font-medium transition-colors duration-300 link-underline ${
                  pathname === href || (href === "/" && pathname === "/")
                    ? "text-emerald-400"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              ref={cartRef}
              href="/#sepet"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-interactive"
            >
              <svg className="w-5 h-5 text-zinc-300 transition-colors group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium text-zinc-300">Sepet</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white animate-subtle-pulse">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/admin"
              className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors duration-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
