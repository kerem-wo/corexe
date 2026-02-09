"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifySiteUpdate } from "@/lib/updateNotifier";
import type { SiteData, Product } from "@/lib/types";

export default function AdminProductsPage() {
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

  function updateProduct(index: number, field: keyof Product, value: string | number | boolean) {
    if (!data) return;
    const products = [...data.products];
    products[index] = { ...products[index], [field]: value };
    setData({ ...data, products });
  }

  function addProduct() {
    if (!data) return;
    const newId = String(Date.now());
    setData({
      ...data,
      products: [
        ...data.products,
        {
          id: newId,
          title: "",
          price: 0,
          image: "",
          description: "",
          category: "PUBG Mobile",
          featured: false,
          order: data.products.length + 1,
        },
      ],
    });
  }

  function removeProduct(index: number) {
    if (!data) return;
    const products = data.products.filter((_, i) => i !== index);
    setData({ ...data, products });
  }

  async function save() {
    if (!data) return;
    
    // Boş title'lı ürünleri kontrol et
    const emptyProducts = data.products.filter(p => !p.title || p.title.trim() === '');
    if (emptyProducts.length > 0) {
      setMessage(`⚠️ ${emptyProducts.length} ürünün başlığı boş! Lütfen doldurun.`);
      return;
    }
    
    setSaving(true);
    setMessage("");
    console.log('💾 Kaydediliyor:', data.products.length, 'ürün');
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      const result = await res.json();
      if (res.ok && result.success) {
        console.log('✅ Veritabanına kaydedildi:', data.products.length, 'ürün');
        // Ana sayfaya güncelleme bildirimi gönder (ANLIK GÜNCELLEME)
        notifySiteUpdate();
        console.log('📢 Güncelleme bildirimi gönderildi');
        
        // Veritabanından tekrar okuyarak doğrula (veritabanına kaydedildiğinden emin ol)
        setTimeout(async () => {
          try {
            const verifyRes = await fetch("/api/site", { cache: 'no-store' });
            const verifiedData = await verifyRes.json();
            console.log('✅ Veritabanı doğrulandı:', verifiedData.products?.length, 'ürün');
            setData(verifiedData);
            setMessage(`✅ Kaydedildi ve doğrulandı! ${verifiedData.products?.length || 0} ürün veritabanında. Ana sayfa anında güncellenecek.`);
          } catch (err) {
            console.error('⚠️ Doğrulama hatası:', err);
            setMessage("✅ Kaydedildi! Ana sayfa anında güncellenecek.");
            // Yine de local state'i güncelle
            setData(data);
          }
        }, 300);
      } else {
        setMessage(`❌ Kayıt başarısız: ${result.error || 'Bilinmeyen hata'}`);
        console.error('❌ Kayıt hatası:', result);
      }
    } catch (error) {
      setMessage(`❌ Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
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
        <h1 className="text-2xl font-bold text-white">Ürünler (Hesaplar)</h1>
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
        {data.products.map((product, i) => (
          <div key={product.id} className="p-6 rounded-2xl glass border border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Ürün {i + 1}</span>
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
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`featured-${i}`}
                checked={product.featured}
                onChange={(e) => updateProduct(i, "featured", e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-emerald-500"
              />
              <label htmlFor={`featured-${i}`} className="text-sm text-zinc-400">
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
