"use client";

import { useEffect, useState } from "react";
import { registerGsapPlugins, gsap } from "@/lib/gsap";
import { listenForSiteUpdates } from "@/lib/updateNotifier";
import { useRef } from "react";
import type { ContactContent } from "@/lib/types";

export default function IletisimPage() {
  const [contact, setContact] = useState<ContactContent | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);

  const loadData = () => {
    fetch("/api/site", { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then((r) => r.json())
      .then((data) => {
        console.log('🔄 İletişim sayfası - Veri yenilendi');
        setContact(data.contact);
      })
      .catch(() => setContact(null));
  };

  useEffect(() => {
    loadData();
    
    // Otomatik güncelleme dinle
    const cleanup = listenForSiteUpdates(() => {
      console.log('⚡ İletişim - Güncelleme algılandı');
      loadData();
    });
    
    // Her 30 saniyede bir otomatik yenile (fallback - çok sık istek yapmamak için)
    const interval = setInterval(loadData, 30000);
    
    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    registerGsapPlugins();
    if (!contact || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, delay: 0.15 + i * 0.1, ease: "power2.out" });
      });
    });
    return () => ctx.revert();
  }, [contact]);

  if (!contact) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-zinc-500 animate-subtle-pulse">
        Yükleniyor...
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, "").replace(/^0/, "90")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div ref={sectionRef} className="glass rounded-2xl border border-white/10 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {contact.title}
        </h1>
        <p className="text-zinc-400 mb-8">{contact.description}</p>
        <div className="space-y-6">
          <a
            ref={(r) => { cardRefs.current[0] = r; }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl glass border border-white/10 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group card-hover"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
              <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">WhatsApp</p>
              <p className="text-sm text-zinc-400">7/24 destek için yazın</p>
            </div>
          </a>
          <div
            ref={(r) => { cardRefs.current[1] = r; }}
            className="flex items-center gap-4 p-4 rounded-xl glass border border-white/10 transition-colors duration-300 hover:bg-white/[0.03]"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">E-posta</p>
              <p className="text-sm text-zinc-400">{contact.email}</p>
            </div>
          </div>
          <div
            ref={(r) => { cardRefs.current[2] = r; }}
            className="flex items-center gap-4 p-4 rounded-xl glass border border-white/10 transition-colors duration-300 hover:bg-white/[0.03]"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Adres</p>
              <p className="text-sm text-zinc-400">{contact.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
