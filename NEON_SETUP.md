# Neon (Netlify DB) Kurulumu

Admin panelinden eklenen içeriklerin kalıcı olması için Neon (Netlify DB) serverless PostgreSQL veritabanı kullanılıyor.

---

## 1. Netlify'da Neon Extension'ını Aktif Et

1. **Netlify Dashboard** → **corexe-best** sitesi
2. Sol menü → **Extensions** → **Neon**
3. **Install** → Neon extension'ı aktif et
4. Netlify otomatik olarak `DATABASE_URL` environment variable'ını ekler

**Alternatif:** Netlify CLI ile:
```bash
npx netlify db init
```

---

## 2. Neon Veritabanı Tablosunu Oluştur

### Yöntem 1: Netlify Dashboard üzerinden

1. **Netlify Dashboard** → **Extensions** → **Neon** → **Open Dashboard**
2. **SQL Editor** → **New query**
3. `neon-init.sql` dosyasının içeriğini yapıştır
4. **Run** → Tablo oluşturuldu ve ilk veriler eklendi

### Yöntem 2: Neon Dashboard üzerinden

1. Neon Dashboard'a git (Netlify'dan link ile veya direkt)
2. **SQL Editor** → **New query**
3. `neon-init.sql` dosyasının içeriğini yapıştır
4. **Run** → Tablo oluşturuldu ve ilk veriler eklendi

---

## 3. Environment Variables Kontrolü

Netlify otomatik olarak `DATABASE_URL` ekler, ama kontrol etmek için:

1. **Netlify Dashboard** → **Site configuration** → **Environment variables**
2. `DATABASE_URL` değişkeninin olduğunu kontrol et
3. Format: `postgresql://user:password@host:port/database?sslmode=require`

---

## 4. Yerel Geliştirme İçin (.env.local)

Proje klasöründe `.env.local` dosyası oluştur:

```env
# Neon Database URL (Netlify Dashboard'dan al)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Admin Panel Giriş Bilgileri (opsiyonel)
ADMIN_EMAIL=admin@corexe.best
ADMIN_PASSWORD=admin123
```

`.env.local` dosyası `.gitignore`'da olduğu için GitHub'a pushlanmaz (güvenli).

---

## 5. Deploy

1. Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**
2. Veya GitHub'a push yaparak otomatik deploy tetiklenir

---

## Avantajlar

✅ **Netlify ile direkt entegre** - Extension ile kolay kurulum  
✅ **Serverless PostgreSQL** - Lambda fonksiyonları ile uyumlu  
✅ **Otomatik environment variables** - `DATABASE_URL` otomatik eklenir  
✅ **Ücretsiz plan** - Küçük/orta siteler için yeterli  
✅ **Database branching** - Preview deploys için ayrı branch'ler  

---

## Sorun Giderme

### DATABASE_URL bulunamıyor
- Netlify Dashboard → **Extensions** → **Neon** → Extension'ın aktif olduğunu kontrol et
- Environment variables'da `DATABASE_URL` olduğunu kontrol et

### Tablo bulunamıyor
- Neon SQL Editor'de `neon-init.sql` script'ini çalıştırdığınızdan emin olun
- Tablo adının `site_data` olduğunu kontrol edin

### Connection hatası
- `DATABASE_URL` formatının doğru olduğunu kontrol edin
- SSL mode'un `require` olduğunu kontrol edin

---

## Sonuç

Artık admin panelinden eklediğin tüm içerikler (slider, banner, ürünler, vb.) Neon veritabanında kalıcı olarak saklanır. Netlify'da Lambda yeniden başlasa bile veriler kaybolmaz.
