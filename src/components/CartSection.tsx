"use client";

import { useRef, useEffect } from "react";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import { useCart } from "@/context/CartContext";

interface CartSectionProps {
  whatsappNumber: string;
}

export default function CartSection({ whatsappNumber }: CartSectionProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, getWhatsAppMessage } = useCart();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsapPlugins();
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 12%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const whatsappUrl = getWhatsAppMessage(whatsappNumber);

  if (items.length === 0) {
    return (
      <section id="sepet" ref={sectionRef} className="glass rounded-2xl border border-white/10 p-12 text-center">
        <p className="text-zinc-400">Sepetiniz boş. Hesaplar bölümünden ürün ekleyebilirsiniz.</p>
      </section>
    );
  }

  return (
    <section id="sepet" ref={sectionRef} className="glass rounded-2xl border border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Sepetiniz</h2>
        <p className="text-sm text-zinc-400">{totalItems} ürün</p>
      </div>
      <ul className="divide-y divide-white/10">
        {items.map((item) => (
          <li key={item.id} className="p-4 flex items-center gap-4 transition-colors duration-200 hover:bg-white/[0.03]">
            <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
              <img
                src={item.image || ""}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{item.title}</p>
              <p className="text-sm text-emerald-400">{item.price.toLocaleString("tr-TR")} ₺ × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              >
                −
              </button>
              <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-zinc-400 hover:text-red-400 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Kaldır"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <p className="text-lg font-bold text-white">
          Toplam: {totalPrice.toLocaleString("tr-TR")} ₺
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] btn-interactive"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Ödeme için iletişime geç
        </a>
      </div>
    </section>
  );
}
