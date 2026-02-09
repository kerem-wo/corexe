"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifySiteUpdate } from "@/lib/updateNotifier";
import type { SiteData, DiscountBanner } from "@/lib/types";

export default function AdminBannersPage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("admin_token");
      const email = sessionStorage.getItem("admin_email");
      if (!token || !email) {
        router.replace("/admin");
        return;
      }
    }
    fetch("/api/site", { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then(setData)
      .catch(() => setData(null));
  }, [router]);

  function updateBanner(index: number, field: keyof DiscountBanner, value: string | number) {
    if (!data) return;
    const discountBanners = [...data.discountBanners];
    discountBanners[index] = { ...discountBanners[index], [field]: value };
    setData({ ...data, discountBanners });
  }

  function addBanner() {
    if (!data) return;
    const newId = String(Date.now());
    setData({
      ...data,
      discountBanners: [
        ...data.discountBanners,
        { id: newId, title: "", subtitle: "", discount: "%10", image: "", link: "/#urunler", order: data.discountBanners.length + 1 },
      ],
    });
  }

  function removeBanner(index: number) {
    if (!data) return;
    const discountBanners = data.discountBanners.filter((_, i) => i !== index);
    setData({ ...data, discountBanners });
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      const result = await res.json();
      if (res.ok && result.success) {
        console.log('✅ Veritabanına kaydedildi:', data.discountBanners.length, 'banner');
        notifySiteUpdate(); // ANLIK GÜNCELLEME
        console.log('📢 Güncelleme bildirimi gönderildi');
        // Veritabanından doğrula
        setTimeout(async () => {
          try {
            const verifyRes = await fetch("/api/site", { cache: 'no-store' });
            const verifiedData = await verifyRes.json();
            console.log('✅ Veritabanı doğrulandı:', verifiedData.discountBanners?.length, 'banner');
            setData(verifiedData);
            setMessage(`✅ Kaydedildi ve doğrulandı! ${verifiedData.discountBanners?.length || 0} banner veritabanında. Ana sayfa anında güncellenecek.`);
          } catch (err) {
            console.error('⚠️ Doğrulama hatası:', err);
            setMessage("✅ Kaydedildi! Ana sayfa anında güncellenecek.");
            setData(data);
          }
        }, 300);
      } else {
        setMessage(`❌ Kayıt başarısız: ${result.error || 'Bilinmeyen hata'}`);
      }
    } catch {
      setMessage("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="p-8 text-zinc-500">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
        ← Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">İndirim Bannerları</h1>
        <div className="flex gap-2">
          <button
            onClick={addBanner}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium"
          >
            + Ekle
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
      {message && <p className="text-sm text-emerald-400 mb-4">{message}</p>}
      <div className="space-y-8">
        {data.discountBanners.map((banner, i) => (
          <div key={banner.id} className="p-6 rounded-2xl glass border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Banner {i + 1}</span>
              <button
                type="button"
                onClick={() => removeBanner(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Sil
              </button>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Başlık</label>
              <input
                value={banner.title}
                onChange={(e) => updateBanner(i, "title", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Alt başlık</label>
              <input
                value={banner.subtitle}
                onChange={(e) => updateBanner(i, "subtitle", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">İndirim (örn: %15)</label>
              <input
                value={banner.discount}
                onChange={(e) => updateBanner(i, "discount", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Görsel URL</label>
              <input
                value={banner.image}
                onChange={(e) => updateBanner(i, "image", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Link</label>
              <input
                value={banner.link}
                onChange={(e) => updateBanner(i, "link", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Sıra</label>
              <input
                type="number"
                value={banner.order}
                onChange={(e) => updateBanner(i, "order", parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
