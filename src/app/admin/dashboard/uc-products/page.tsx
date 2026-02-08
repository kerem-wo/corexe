"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SiteData, Product } from "@/lib/types";

export default function AdminUcProductsPage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("admin_token")) {
      router.replace("/admin");
      return;
    }
    fetch("/api/site")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [router]);

  function updateProduct(index: number, field: keyof Product, value: string | number | boolean) {
    if (!data) return;
    const ucProducts = [...(data.ucProducts ?? [])];
    ucProducts[index] = { ...ucProducts[index], [field]: value };
    setData({ ...data, ucProducts });
  }

  function addProduct() {
    if (!data) return;
    const newId = "uc-" + Date.now();
    const list = data.ucProducts ?? [];
    setData({
      ...data,
      ucProducts: [
        ...list,
        {
          id: newId,
          title: "",
          price: 0,
          image: "",
          description: "",
          category: "PUBG Mobile UC",
          featured: false,
          order: list.length + 1,
        },
      ],
    });
  }

  function removeProduct(index: number) {
    if (!data) return;
    const ucProducts = (data.ucProducts ?? []).filter((_, i) => i !== index);
    setData({ ...data, ucProducts });
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

  const list = data.ucProducts ?? [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
        ← Dashboard
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">UC Satışları</h1>
        <div className="flex gap-2">
          <button
            onClick={addProduct}
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
        {list.map((product, i) => (
          <div key={product.id} className="p-6 rounded-2xl glass border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">UC Ürünü {i + 1}</span>
              <button
                type="button"
                onClick={() => removeProduct(i)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Sil
              </button>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Başlık (Ürün adı)</label>
              <input
                value={product.title}
                onChange={(e) => updateProduct(i, "title", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Fiyat (₺)</label>
              <input
                type="number"
                value={product.price}
                onChange={(e) => updateProduct(i, "price", parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Görsel URL</label>
              <input
                value={product.image}
                onChange={(e) => updateProduct(i, "image", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Açıklama</label>
              <input
                value={product.description}
                onChange={(e) => updateProduct(i, "description", e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Kategori</label>
              <input
                value={product.category}
                onChange={(e) => updateProduct(i, "category", e.target.value)}
                placeholder="PUBG Mobile UC"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`uc-featured-${i}`}
                checked={product.featured}
                onChange={(e) => updateProduct(i, "featured", e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-emerald-500"
              />
              <label htmlFor={`uc-featured-${i}`} className="text-sm text-zinc-400">
                Öne çıkan
              </label>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Sıra</label>
              <input
                type="number"
                value={product.order}
                onChange={(e) => updateProduct(i, "order", parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
