# Veritabanı Kurulumu - PostgreSQL

Proje artık sadece PostgreSQL kullanıyor. Vercel Prisma Postgres veya başka bir PostgreSQL servisi kullanabilirsiniz.

---

## 1. PostgreSQL Connection String Al

### Vercel Prisma Postgres Kullanıyorsanız:

1. **Vercel Dashboard** → Projenizi seçin
2. **Storage** → **Prisma Postgres** → Veritabanınızı seçin
3. Connection string'i kopyalayın:
   ```
   postgres://user:password@db.prisma.io:5432/postgres?sslmode=require
   ```

### Başka Bir PostgreSQL Servisi Kullanıyorsanız:

- **Railway**: Railway Dashboard → PostgreSQL → **Connect** → Connection string
- **Neon**: Neon Dashboard → **Connection string**
- **Heroku Postgres**: Heroku Dashboard → **Settings** → **Database Credentials**

---

## 2. Vercel'de Environment Variable Ekle

1. **Vercel Dashboard** → Projenizi seçin
2. **Settings** → **Environment Variables**
3. **Add** → Yeni değişken:
   - **Key:** `DATABASE_URL`
   - **Value:** PostgreSQL connection string'iniz
   - **Environment:** Production, Preview, Development (hepsini seç)
4. **Save**

---

## 3. Yerel Geliştirme İçin (.env.local)

Proje klasöründe `.env.local` dosyası oluştur:

```env
# PostgreSQL Connection String
DATABASE_URL=postgres://user:password@host:5432/database?sslmode=require

# Admin Panel Giriş Bilgileri
ADMIN_EMAIL=xcorexebest@adminplat.com
ADMIN_PASSWORD=CorexeBest09022026
```

`.env.local` dosyası `.gitignore`'da olduğu için GitHub'a pushlanmaz (güvenli).

---

## 4. Veritabanı Tablosunu Oluştur

### Yöntem 1: Reset Script (Önerilen)

Terminal'de:

```bash
node scripts/reset-db.js
```

Bu script:
- Eski tabloyu siler (varsa)
- Yeni tablo oluşturur
- İlk verileri ekler (COREXE BEST default data)

### Yöntem 2: Init Script

Terminal'de:

```bash
node scripts/init-db.js
```

Bu script sadece tablo oluşturur ve ilk veriyi ekler (tablo varsa hata vermez).

### Yöntem 3: Manuel SQL

PostgreSQL client'ınızda (psql, pgAdmin, vb.) şu SQL'i çalıştırın:

```sql
-- Tablo oluştur
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

---

## 5. Deploy

1. Vercel Dashboard → **Deploys** → Yeni deploy otomatik başlar
2. Veya GitHub'a push yaparak otomatik deploy tetiklenir

---

## Avantajlar

✅ **Sadece PostgreSQL** - Bağımlılık yok  
✅ **Herhangi bir PostgreSQL servisi** - Vercel Prisma Postgres, Railway, Neon, Heroku Postgres, vb.  
✅ **Daha fazla kontrol** - SQL sorgularını direkt yazabilirsiniz  
✅ **Performans** - Connection pool ile optimize edilmiş  
✅ **Temiz kod** - Gereksiz bağımlılıklar yok  

---

## Script'ler

- `scripts/reset-db.js` - Veritabanını temizle ve sıfırdan kur
- `scripts/init-db.js` - Tablo oluştur ve ilk veriyi ekle

---

## Notlar

- `DATABASE_URL` environment variable'ı **mutlaka** eklenmeli
- Connection string formatı: `postgresql://user:password@host:port/database?sslmode=require`
- SSL mode genellikle `require` olmalı (cloud PostgreSQL servisleri için)
- Admin panelinden yapılan tüm değişiklikler otomatik olarak veritabanına kaydedilir ve site anında güncellenir

---

## Sorun Giderme

### Connection hatası
- `DATABASE_URL` doğru mu kontrol edin
- Connection string formatını kontrol edin
- SSL mode'un `require` olduğundan emin olun

### Tablo bulunamıyor
- `scripts/reset-db.js` veya `scripts/init-db.js` script'ini çalıştırdığınızdan emin olun
- PostgreSQL client'ınızda tablo oluşturulduğunu kontrol edin

### Environment variable çalışmıyor
- Vercel'de environment variable ekledikten sonra **yeni deploy** yapın
- Production, Preview, Development için ayrı ayrı ekleyin
