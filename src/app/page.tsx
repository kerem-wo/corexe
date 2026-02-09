"use client";

import { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import DiscountBanners from "@/components/DiscountBanners";
import ProductCard from "@/components/ProductCard";
import SocialLinksSection from "@/components/SocialLinksSection";
import CartSection from "@/components/CartSection";
import AnimatedSection from "@/components/AnimatedSection";
import { registerGsapPlugins } from "@/lib/gsap";
import { useSiteData } from "@/context/SiteDataContext";

export default function HomePage() {
  const { data, loading } = useSiteData();

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="animate-subtle-pulse text-zinc-500">Yükleniyor...</div>
      </div>
    );
  }

  // Boş ürünleri filtrele ve sırala
  const products = [...(data.products || [])]
    .filter(p => p && p.title && p.title.trim() !== '') // Boş title'ları filtrele
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const ucProducts = [...(data.ucProducts || [])]
    .filter(p => p && p.title && p.title.trim() !== '') // Boş title'ları filtrele
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const socialLinks = [...(data.socialLinks || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Debug: Console'da ürün sayılarını göster
  console.log(`📦 Ürünler: ${products.length} adet (toplam: ${data.products?.length || 0})`);
  console.log(`💰 UC Ürünleri: ${ucProducts.length} adet (toplam: ${data.ucProducts?.length || 0})`);
  if (products.length !== (data.products?.length || 0)) {
    console.warn('⚠️ Bazı ürünler boş title nedeniyle filtrelendi!');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <AnimatedSection className="pt-4" y={24} delay={0}>
        <HeroSlider sliders={data.sliders} />
      </AnimatedSection>

      <section>
        <DiscountBanners banners={data.discountBanners} />
      </section>

      <AnimatedSection id="urunler" className="scroll-mt-24" y={50} delay={0.1}>
        <h2 className="text-3xl font-bold text-white mb-2">Oyun Hesapları</h2>
        <p className="text-zinc-400 mb-6">Güvenilir oyun hesapları, anında teslimat.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection id="uc" className="scroll-mt-24" y={50} delay={0.1}>
        <h2 className="text-3xl font-bold text-white mb-2">UC Satışları</h2>
        <p className="text-zinc-400 mb-6">PUBG Mobile ve diğer oyunlar için UC paketleri.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ucProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </AnimatedSection>

      <SocialLinksSection links={socialLinks} />

      <section>
        <CartSection whatsappNumber={data.site.whatsapp} />
      </section>
    </div>
  );
}
