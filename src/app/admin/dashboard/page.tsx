"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteData } from "@/lib/types";

export default function AdminDashboardPage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("admin_token")) {
      router.replace("/admin");
      return;
    }
    fetch("/api/site")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    router.replace("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white">
              Siteye Git
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Çıkış
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/dashboard/site"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">Site Ayarları</h2>
            <p className="text-sm text-zinc-400">Site adı, WhatsApp, e-posta, adres.</p>
          </Link>
          <Link
            href="/admin/dashboard/sliders"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">Slider</h2>
            <p className="text-sm text-zinc-400">Ana sayfa slider öğeleri. ({data?.sliders?.length ?? 0} adet)</p>
          </Link>
          <Link
            href="/admin/dashboard/banners"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">İndirim Bannerları</h2>
            <p className="text-sm text-zinc-400">Reklam / indirim bannerları. ({data?.discountBanners?.length ?? 0} adet)</p>
          </Link>
          <Link
            href="/admin/dashboard/products"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">Oyun Hesapları</h2>
            <p className="text-sm text-zinc-400">Satışa sunulan oyun hesapları. ({data?.products?.length ?? 0} adet)</p>
          </Link>
          <Link
            href="/admin/dashboard/uc-products"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">UC Satışları</h2>
            <p className="text-sm text-zinc-400">UC paketleri (PUBG Mobile vb.). ({data?.ucProducts?.length ?? 0} adet)</p>
          </Link>
          <Link
            href="/admin/dashboard/social-links"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">Sosyal Medya (Takip)</h2>
            <p className="text-sm text-zinc-400">Takip / destek için sosyal medya linkleriniz. ({data?.socialLinks?.length ?? 0} adet)</p>
          </Link>
          <Link
            href="/admin/dashboard/about"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">Hakkımızda</h2>
            <p className="text-sm text-zinc-400">Hakkımızda sayfası metni.</p>
          </Link>
          <Link
            href="/admin/dashboard/contact"
            className="block p-6 rounded-2xl glass border border-white/10 hover:border-emerald-500/30 transition-colors"
          >
            <h2 className="text-lg font-semibold text-white mb-2">İletişim</h2>
            <p className="text-sm text-zinc-400">İletişim bilgileri.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
