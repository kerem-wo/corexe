"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifySiteUpdate, listenForSiteUpdates } from "@/lib/updateNotifier";
import type { SiteData } from "@/lib/types";

export default function AdminSitePage() {
  const [data, setData] = useState<SiteData | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadData = () => {
    fetch("/api/site", { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then((r) => {
        if (!r.ok) throw new Error('API error');
        return r.json();
      })
      .then((d) => {
        console.log('🔄 Admin panel - Veri yenilendi:', d.site?.name);
        setData(d);
        setForm({
          name: d.site?.name ?? "",
          whatsapp: d.site?.whatsapp ?? "",
          email: d.site?.email ?? "",
          address: d.site?.address ?? "",
        });
      })
      .catch(() => setData(null));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("admin_token");
      const email = sessionStorage.getItem("admin_email");
      if (!token || !email) {
        router.replace("/admin");
        return;
      }
    }
    loadData();
    
    // Otomatik güncelleme dinle (başka admin panelinden yapılan değişiklikler için)
    const cleanup = listenForSiteUpdates(() => {
      console.log('⚡ Admin panel - Güncelleme algılandı');
      loadData();
    });
    
    // Her 3 saniyede bir otomatik yenile
    const interval = setInterval(loadData, 3000);
    
    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          site: { ...data.site, ...form },
        }),
        cache: 'no-store',
      });
      const result = await res.json();
      if (res.ok && result.success) {
        console.log('✅ Veritabanına kaydedildi: Site ayarları');
        notifySiteUpdate(); // ANLIK GÜNCELLEME
        console.log('📢 Güncelleme bildirimi gönderildi');
        // Veritabanından doğrula ve formu güncelle
        setTimeout(async () => {
          try {
            const verifyRes = await fetch("/api/site", { 
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
              }
            });
            const verifiedData = await verifyRes.json();
            console.log('✅ Veritabanı doğrulandı: Site ayarları');
            setData(verifiedData);
            setForm({
              name: verifiedData.site?.name ?? "",
              whatsapp: verifiedData.site?.whatsapp ?? "",
              email: verifiedData.site?.email ?? "",
              address: verifiedData.site?.address ?? "",
            });
            setMessage("✅ Kaydedildi ve doğrulandı! Site adı ve tüm ayarlar anında güncellendi.");
          } catch (err) {
            console.error('⚠️ Doğrulama hatası:', err);
            setMessage("✅ Kaydedildi! Ana sayfa anında güncellenecek.");
            setData({ ...data, site: { ...data.site, ...form } });
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
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <Link href="/admin/dashboard" className="text-sm text-zinc-400 hover:text-white mb-6 inline-block">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">Site Ayarları</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Site Adı</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">WhatsApp (90 ile başlayan)</label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            placeholder="905551234567"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">E-posta</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Adres</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />
        </div>
        {message && <p className="text-sm text-emerald-400">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
