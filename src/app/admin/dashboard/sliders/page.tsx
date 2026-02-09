"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteData, SliderItem } from "@/lib/types";

export default function AdminSlidersPage() {
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
    fetch("/api/site")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [router]);

  function updateSlider(index: number, field: keyof SliderItem, value: string | number) {
    if (!data) return;
    const sliders = [...data.sliders];
    sliders[index] = { ...sliders[index], [field]: value };
    setData({ ...data, sliders });
  }

  function addSlider() {
    if (!data) return;
    const newId = String(Date.now());
    setData({
      ...data,
      sliders: [
        ...data.sliders,
        { id: newId, title: "", subtitle: "", description: "", image: "", link: "/#urunler", order: data.sliders.length + 1 },
      ],
    });
  }

  function removeSlider(index: number) {
    if (!data) return;
    const sliders = data.sliders.filter((_, i) => i !== index);
    setData({ ...data, sliders });
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
      });
      if (res.ok) setMessage("Kaydedildi.");
      else setMessage("Kayıt başarısız.");
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
        <h1 className="text-2xl font-bold text-white">Slider</h1>
        <div className="flex gap-2">
          <button
            onClick={addSlider}
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
        {data.sliders.map((slide, i) => (
          <div key={slide.id} className="p-6 rounded-2xl glass border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Slide {i + 1}</span>
              <button
                type="button"
                onClick={() => removeSlider(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Sil
              </button>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Başlık</label>
              <input
                value={slide.title}
                onChange={(e) => updateSlider(i, "title", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Alt başlık</label>
              <input
                value={slide.subtitle}
                onChange={(e) => updateSlider(i, "subtitle", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Açıklama</label>
              <input
                value={slide.description}
                onChange={(e) => updateSlider(i, "description", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Görsel URL</label>
              <input
                value={slide.image}
                onChange={(e) => updateSlider(i, "image", e.target.value)}
                placeholder="/images/slider.jpg"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Link</label>
              <input
                value={slide.link}
                onChange={(e) => updateSlider(i, "link", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Sıra</label>
              <input
                type="number"
                value={slide.order}
                onChange={(e) => updateSlider(i, "order", parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
