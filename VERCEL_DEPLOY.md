# Vercel'e Deploy Rehberi

Netlify limit aşımı nedeniyle projeyi Vercel'e taşıyoruz. Vercel Next.js için optimize edilmiş ve ücretsiz planı daha cömert.

---

## 1. Vercel Hesabı Oluştur

1. [https://vercel.com](https://vercel.com) → **Sign Up**
2. **GitHub** ile giriş yap (aynı GitHub hesabınızla)

---

## 2. Projeyi Vercel'e Bağla

1. Vercel Dashboard → **Add New** → **Project**
2. **Import Git Repository** → `kerem-wo/corexe` seç
3. **Configure Project**:
   - **Framework Preset:** Next.js (otomatik algılanır)
   - **Root Directory:** `./` (varsayılan)
   - **Build Command:** `npm run build` (varsayılan)
   - **Output Directory:** `.next` (varsayılan)
   - **Install Command:** `npm install` (varsayılan)

---

## 3. Environment Variables Ekle

**Settings** → **Environment Variables** → **Add**:

### 1. Supabase URL
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://shcxrmpqdbbfdwbqucij.supabase.co`
- **Environment:** Production, Preview, Development (hepsini seç)

### 2. Supabase Anon Key
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3hybXBxZGJiZmR3YnF1Y2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzA5MzUsImV4cCI6MjA4NjIwNjkzNX0.ZdmH1S9ouyE10SmsOlY8BZndscQwLBMuFJpn29qwwdc`
- **Environment:** Production, Preview, Development (hepsini seç)

### 3. Admin Email
- **Key:** `ADMIN_EMAIL`
- **Value:** `admin@corexe.best` (veya istediğiniz email)
- **Environment:** Production, Preview, Development (hepsini seç)

### 4. Admin Password
- **Key:** `ADMIN_PASSWORD`
- **Value:** `admin123` (veya istediğiniz şifre)
- **Environment:** Production, Preview, Development (hepsini seç)

---

## 4. Deploy Et

1. **Deploy** butonuna tıkla
2. Build tamamlanana kadar bekle (2-3 dakika)
3. Deploy başarılı olduğunda **Visit** butonuna tıkla

---

## 5. Custom Domain (Opsiyonel)

1. **Settings** → **Domains**
2. **Add Domain** → Domain adınızı girin
3. DNS ayarlarını yapın (Vercel size talimat verecek)

---

## Vercel Avantajları

✅ **Next.js için optimize** - Netlify'dan daha hızlı build  
✅ **Daha cömert ücretsiz plan** - 100GB bandwidth, sınırsız build  
✅ **Otomatik HTTPS** - SSL sertifikası otomatik  
✅ **Edge Functions** - Daha hızlı API routes  
✅ **Preview Deployments** - Her PR için otomatik preview  

---

## Notlar

- Vercel Next.js API routes'u otomatik algılar (Netlify gibi ekstra config gerekmez)
- Environment variables ekledikten sonra **yeni bir deploy** yapın
- Supabase veritabanı zaten hazır, sadece environment variables'ı eklemeniz yeterli
- Admin paneli `/admin` adresinde çalışmaya devam edecek

---

## Sorun Giderme

### Build Hatası
- **Logs** sekmesinden build loglarını kontrol edin
- Environment variables'ın doğru eklendiğinden emin olun

### API Routes Çalışmıyor
- Vercel Next.js API routes'u otomatik algılar, ekstra config gerekmez
- `src/app/api/` klasöründeki route'lar otomatik çalışır

### Environment Variables Çalışmıyor
- Environment variables ekledikten sonra **mutlaka yeni deploy** yapın
- Production, Preview, Development için ayrı ayrı ekleyin
