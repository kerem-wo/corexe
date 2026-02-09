# Supabase Veritabanı Kurulumu

Admin panelinden eklenen içeriklerin kalıcı olması için Supabase veritabanı kullanılıyor.

---

## 1. Supabase Hesabı Oluştur

1. [supabase.com](https://supabase.com) → **Start your project** → Ücretsiz hesap aç.
2. **New project** → Proje adı: `corexe-best` (veya istediğin ad).
3. **Database password** belirle (güçlü bir şifre).
4. **Region** seç (Türkiye için en yakın: `West Europe` veya `Central EU`).
5. **Create new project** → 1-2 dakika bekle (veritabanı hazırlanıyor).

---

## 2. Veritabanı Tablosu Oluştur

Supabase Dashboard'da:

1. Sol menü → **SQL Editor**.
2. **New query** → Aşağıdaki SQL'i yapıştır:

```sql
-- site_data tablosu oluştur
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlk veriyi ekle (site-data.json içeriğini kopyala)
INSERT INTO site_data (id, data)
VALUES ('main', '{
  "site": {
    "name": "COREXE BEST",
    "whatsapp": "+905527374558",
    "email": "corexe@best.com",
    "address": "İstanbul, Türkiye"
  },
  "sliders": [],
  "discountBanners": [],
  "products": [],
  "ucProducts": [],
  "socialLinks": [],
  "about": {
    "title": "Hakkımızda",
    "content": "COREXE BEST olarak oyun hesap satışı, UC satışı ve sosyal medya hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz."
  },
  "contact": {
    "title": "İletişim",
    "description": "Sorularınız için bize ulaşın.",
    "whatsapp": "+905527374558",
    "email": "corexe@best.com",
    "address": "İstanbul, Türkiye"
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;
```

3. **Run** (veya F5) → Tablo oluşturuldu ve ilk veri eklendi.

---

## 3. API Anahtarlarını Al

Supabase Dashboard'da:

1. Sol menü → **Settings** → **API**.
2. **Project URL** → Kopyala (örn: `https://xxxxx.supabase.co`).
3. **anon public** key → Kopyala (uzun bir string).

---

## 4. Netlify'da Ortam Değişkenlerini Ekle

Netlify Dashboard'da:

1. **corexe-best** sitesi → **Site configuration** → **Environment variables**.
2. **Add a variable** → İki değişken ekle:

   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`  
     **Value:** Supabase Project URL (3. adımdan)
   
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     **Value:** Supabase anon key (3. adımdan)

3. **Save** → **Trigger deploy** ile yeniden deploy et.

---

## 5. Yerel Geliştirme İçin (.env.local)

Proje klasöründe `.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

`.env.local` dosyası `.gitignore`'da olduğu için GitHub'a pushlanmaz (güvenli).

---

## Sonuç

Artık admin panelinden eklediğin tüm içerikler (slider, banner, ürünler, vb.) Supabase veritabanında kalıcı olarak saklanır. Netlify'da Lambda yeniden başlasa bile veriler kaybolmaz.

**Not:** Supabase ücretsiz planında 500MB veritabanı ve 2GB bant genişliği var - küçük/orta siteler için yeterli.
