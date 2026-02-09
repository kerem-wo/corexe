# Neon Veritabanı Kurulumu - Netlify Dashboard

Neon extension zaten kurulu! Şimdi veritabanını başlatıp tabloyu oluşturalım.

---

## 1. Neon Dashboard'a Git

1. **Netlify Dashboard** → **corexe-best** sitesi
2. Sol menü → **Extensions** → **Neon**
3. **Open Dashboard** butonuna tıkla
   - Veya direkt Neon Dashboard'a giriş yap: [console.neon.tech](https://console.neon.tech)

---

## 2. Veritabanı Bağlantısını Kontrol Et

Netlify otomatik olarak `DATABASE_URL` environment variable'ını ekler:

1. **Netlify Dashboard** → **Site configuration** → **Environment variables**
2. `DATABASE_URL` değişkeninin olduğunu kontrol et
3. Format: `postgresql://user:password@host:port/database?sslmode=require`

**Not:** Eğer `DATABASE_URL` yoksa, Neon Dashboard'dan connection string'i kopyalayıp manuel ekleyin.

---

## 3. SQL Script'i Çalıştır

1. **Neon Dashboard** → Sol menü → **SQL Editor**
2. **New query** → Yeni bir query oluştur
3. `neon-init.sql` dosyasının **tüm içeriğini** kopyala ve yapıştır
4. **Run** (veya F5) → Tablo oluşturuldu ve ilk veriler eklendi

**Önemli:** Script'i çalıştırdıktan sonra tablo oluşturulduğunu kontrol et:
- Sol menü → **Tables** → `site_data` tablosunu görmelisiniz

---

## 4. Test Et

1. **Netlify Dashboard** → **Deploys** → **Trigger deploy** → **Deploy site**
2. Deploy tamamlandıktan sonra siteyi aç
3. Admin panelinden (`/admin`) bir değişiklik yap
4. Değişikliğin kalıcı olduğunu kontrol et (sayfayı yenile)

---

## Sorun Giderme

### DATABASE_URL bulunamıyor
- Netlify Dashboard → **Extensions** → **Neon** → Extension aktif mi kontrol et
- Neon Dashboard → **Settings** → **Connection string** → Kopyala ve Netlify'a ekle

### Tablo bulunamıyor
- Neon SQL Editor'de `neon-init.sql` script'ini çalıştırdığınızdan emin olun
- Neon Dashboard → **Tables** → `site_data` tablosunu kontrol edin

### Connection hatası
- `DATABASE_URL` formatının doğru olduğunu kontrol edin
- SSL mode'un `require` olduğunu kontrol edin
- Neon Dashboard → **Settings** → Connection string'i yeniden kopyalayın

---

## Sonuç

Artık admin panelinden eklediğin tüm içerikler Neon veritabanında kalıcı olarak saklanır! 🎉
