"use client";

import { useRef, useEffect } from "react";
import { registerGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    registerGsapPlugins();
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none none",
          },
        }
      );
    }, cardRef);
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="glass rounded-2xl border border-white/10 overflow-hidden card-hover group"
    >
      <div ref={imgRef} className="relative aspect-video bg-zinc-800/50 overflow-hidden">
        <img
          src={product.image || "/placeholder-product.svg"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect fill='%23374151' width='400' height='225'/%3E%3Ctext fill='%239ca3af' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3EGörsel%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-xs font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
          {product.price.toLocaleString("tr-TR")} ₺
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{product.title}</h3>
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{product.description}</p>
        <button
          ref={btnRef}
          onClick={() => addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
          })}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-interactive"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
