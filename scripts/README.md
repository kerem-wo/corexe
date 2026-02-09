# Veritabanı Kurulum Scriptleri

## init-db.js

Vercel Prisma Postgres için veritabanı tablosunu oluşturur.

### Kullanım

1. `.env.local` dosyası oluşturun (proje kök dizininde):
   ```env
   DATABASE_URL="postgres://9aa6b46d2396ad0a3a515f6f65e2f107522a24439555d5fc6790eebf2ce3b32f:sk__OUr8RGXpgGNv-NIkI3T7@db.prisma.io:5432/postgres?sslmode=require"
   ```

2. Script'i çalıştırın:
   ```bash
   node scripts/init-db.js
   ```

### Ne Yapar?

- `site_data` tablosunu oluşturur
- İlk veriyi ekler (COREXE BEST default data)
- Tablonun başarıyla oluşturulduğunu kontrol eder
