# Vercel Prisma Postgres Kurulumu

Vercel'de Prisma Postgres oluşturdunuz ve environment variables eklediniz. Şimdi veritabanı tablosunu oluşturalım.

---

## 1. Veritabanı Tablosunu Oluştur

Vercel Prisma Postgres'te SQL sorgularını çalıştırmak için birkaç yöntem var:

### Yöntem 1: Vercel Dashboard (Önerilen)

1. **Vercel Dashboard** → Projenizi seçin
2. **Storage** → **Prisma Postgres** → Veritabanınızı seçin
3. **SQL Editor** veya **Query** sekmesine gidin
4. `prisma-init.sql` dosyasının içeriğini yapıştırın
5. **Run** → Tablo oluşturuldu

### Yöntem 2: Prisma Studio (Yerel)

1. Terminal'de proje klasörüne gidin:
   ```bash
   cd c:\Users\kerem\Desktop\corexe
   ```

2. `.env.local` dosyası oluşturun (eğer yoksa):
   ```env
   DATABASE_URL="postgres://9aa6b46d2396ad0a3a515f6f65e2f107522a24439555d5fc6790eebf2ce3b32f:sk__OUr8RGXpgGNv-NIkI3T7@db.prisma.io:5432/postgres?sslmode=require"
   ADMIN_EMAIL=xcorexebest@adminplat.com
   ADMIN_PASSWORD=CorexeBest09022026
   ```

3. `psql` veya PostgreSQL client ile bağlanın:
   ```bash
   # psql ile (eğer yüklüyse)
   psql "postgres://9aa6b46d2396ad0a3a515f6f65e2f107522a24439555d5fc6790eebf2ce3b32f:sk__OUr8RGXpgGNv-NIkI3T7@db.prisma.io:5432/postgres?sslmode=require"
   ```

4. SQL sorgusunu çalıştırın:
   ```sql
   -- prisma-init.sql içeriğini buraya yapıştırın
   ```

### Yöntem 3: Node.js Script (En Kolay)

Aşağıdaki script'i çalıştırarak tabloyu oluşturabilirsiniz:

1. Terminal'de:
   ```bash
   cd c:\Users\kerem\Desktop\corexe
   ```

2. `.env.local` dosyası oluşturun (yukarıdaki gibi)

3. Script'i çalıştırın:
   ```bash
   node scripts/init-db.js
   ```

---

## 2. Tablo Oluşturuldu mu Kontrol Et

Vercel Dashboard'da veya SQL Editor'de:

```sql
SELECT * FROM site_data WHERE id = 'main';
```

Bu sorgu bir satır döndürmeli.

---

## 3. Deploy ve Test

1. **Vercel Dashboard** → **Deploys** → Yeni deploy başlatın (veya otomatik başlar)
2. Siteyi açın: `https://corexe.vercel.app/`
3. Admin panelini açın: `https://corexe.vercel.app/admin`
   - Email: `xcorexebest@adminplat.com`
   - Password: `CorexeBest09022026`
4. Bir ürün ekleyin ve kaydedin
5. Ana sayfada göründüğünü kontrol edin

---

## Sorun Giderme

### Tablo bulunamıyor
- SQL script'ini çalıştırdığınızdan emin olun
- Vercel Dashboard → Storage → Prisma Postgres → SQL Editor'den kontrol edin

### Connection hatası
- `DATABASE_URL` environment variable'ının doğru olduğunu kontrol edin
- Vercel Dashboard → Settings → Environment Variables → `DATABASE_URL` kontrol edin

### Admin paneli çalışmıyor
- `ADMIN_EMAIL` ve `ADMIN_PASSWORD` environment variables'larının doğru olduğunu kontrol edin
- Vercel Dashboard → Settings → Environment Variables → Kontrol edin

---

## Notlar

- Vercel Prisma Postgres ücretsiz planında 256 MB veritabanı alanı var
- Connection string formatı: `postgres://user:password@host:port/database?sslmode=require`
- SSL mode `require` olmalı (Vercel Prisma Postgres için zorunlu)
