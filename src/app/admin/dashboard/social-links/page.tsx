"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteData, SocialLink } from "@/lib/types";

export default function AdminSocialLinksPage() {
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

  function updateLink(index: number, field: keyof SocialLink, value: string | number) {
    if (!data) return;
    const socialLinks = [...(data.socialLinks ?? [])];
    socialLinks[index] = { ...socialLinks[index], [field]: value };
    setData({ ...data, socialLinks });
  }

  function addLink() {
    if (!data) return;
    const newId = "sl-" + Date.now();
    const list = data.socialLinks ?? [];
    setData({
      ...data,
      socialLinks: [
        ...list,
        { id: newId, platform: "Instagram", url: "", order: list.length + 1 },
      ],
    });
  }

  function removeLink(index: number) {
    if (!data) return;
    const socialLinks = (data.socialLinks ?? []).filter((_, i) => i !== index);
    setData({ ...data, socialLinks });
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
        setMessage("✅ Kaydedildi! Sayfayı yenileyin.");
        // Veriyi tekrar yükle
        setTimeout(() => {
          fetch("/api/site", { cache: 'no-store' })
            .then((r) => r.json())
            .then(setData)
            .catch(() => {});
        }, 500);
      } else {
        setMessage(`❌ Kayıt başarısız: ${result.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      setMessage(`❌ Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="p-8 text-zinc-500">Yükleniyor...</div>;

  const list = data.socialLinks ?? [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
        ← Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Sosyal Medya (Takip / Destek)</h1>
        <div className="flex gap-2">
          <button
            onClick={addLink}
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
      <p className="text-sm text-zinc-400 mb-6">Sitede &quot;Bizi takip edin&quot; bölümünde gösterilecek sosyal medya hesaplarınız. Satış yok, sadece takip / destek amaçlı linkler.</p>
      {message && <p className="text-sm text-emerald-400 mb-4">{message}</p>}
      <div className="space-y-8">
        {list.map((link, i) => (
          <div key={link.id} className="p-6 rounded-2xl glass border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Link {i + 1}</span>
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Sil
              </button>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Platform (örn: Instagram, TikTok, YouTube)</label>
              <input
                value={link.platform}
                onChange={(e) => updateLink(i, "platform", e.target.value)}
                placeholder="Instagram"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Profil URL</label>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://instagram.com/kullaniciadi"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Sıra</label>
              <input
                type="number"
                value={link.order}
                onChange={(e) => updateLink(i, "order", parseInt(e.target.value, 10) || 0)}
                placeholder="1"
                title="Sıra numarası"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
