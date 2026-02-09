# PostgreSQL Kurulumu

Proje artık direkt PostgreSQL bağlantısı kullanıyor (Supabase client yerine).

---

## 1. PostgreSQL Connection String Al

### Supabase PostgreSQL Kullanıyorsanız:

1. **Supabase Dashboard** → Projenizi seçin
2. Sol menü → **Settings** → **Database**
3. **Connection string** → **URI** sekmesine tıklayın
4. Connection string'i kopyalayın:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   - `[YOUR-PASSWORD]` → Proje oluştururken belirlediğiniz şifre
   - `[PROJECT-REF]` → Proje referansı (örn: `shcxrmpqdbbfdwbqucij`)

### Başka Bir PostgreSQL Servisi Kullanıyorsanız:

- **Railway**: Railway Dashboard → PostgreSQL → **Connect** → Connection string
- **Neon**: Neon Dashboard → **Connection string**
- **Vercel Postgres**: Vercel Dashboard → **Storage** → **Postgres** → **.env.local**
- **Heroku Postgres**: Heroku Dashboard → **Settings** → **Database Credentials**

---

## 2. Vercel'de Environment Variable Ekle

1. **Vercel Dashboard** → Projenizi seçin
2. **Settings** → **Environment Variables**
3. **Add** → Yeni değişken ekle:
   - **Key:** `DATABASE_URL`
   - **Value:** PostgreSQL connection string'iniz
   - **Environment:** Production, Preview, Development (hepsini seç)
4. **Save**

---

## 3. Yerel Geliştirme İçin (.env.local)

Proje klasöründe `.env.local` dosyası oluştur:

```env
# PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:password@host:5432/database?sslmode=require

# Admin Panel Giriş Bilgileri
ADMIN_EMAIL=admin@corexe.best
ADMIN_PASSWORD=admin123
```

`.env.local` dosyası `.gitignore`'da olduğu için GitHub'a pushlanmaz (güvenli).

---

## 4. Veritabanı Tablosunu Oluştur

PostgreSQL veritabanınızda şu SQL'i çalıştırın:

```sql
-- site_data tablosu oluştur
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlk veriyi ekle (opsiyonel - admin panelinden de ekleyebilirsiniz)
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

### Supabase SQL Editor'de:

1. **Supabase Dashboard** → Sol menü → **SQL Editor**
2. **New query** → Yukarıdaki SQL'i yapıştır
3. **Run** (veya F5) → Tablo oluşturuldu

---

## 5. Deploy

1. Vercel Dashboard → **Deploys** → Yeni deploy otomatik başlar
2. Veya GitHub'a push yaparak otomatik deploy tetiklenir

---

## Avantajlar

✅ **Direkt PostgreSQL** - Supabase client'a bağımlı değil  
✅ **Herhangi bir PostgreSQL servisi** - Supabase, Neon, Railway, Vercel Postgres, vb.  
✅ **Daha fazla kontrol** - SQL sorgularını direkt yazabilirsiniz  
✅ **Performans** - Connection pool ile optimize edilmiş  

---

## Notlar

- `DATABASE_URL` environment variable'ı **mutlaka** eklenmeli
- Connection string formatı: `postgresql://user:password@host:port/database?sslmode=require`
- SSL mode genellikle `require` olmalı (cloud PostgreSQL servisleri için)
- Supabase kullanıyorsanız, connection string'de şifreyi doğru yazdığınızdan emin olun

---

## Sorun Giderme

### Connection hatası
- `DATABASE_URL` doğru mu kontrol edin
- Connection string formatını kontrol edin
- SSL mode'un `require` olduğundan emin olun

### Tablo bulunamıyor
- SQL script'ini çalıştırdığınızdan emin olun
- Tablo adının `site_data` olduğunu kontrol edin

### Environment variable çalışmıyor
- Vercel'de environment variable ekledikten sonra **yeni deploy** yapın
- Production, Preview, Development için ayrı ayrı ekleyin
