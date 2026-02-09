# API 405 Hatası Çözümü

## Sorun
`/api/site` endpoint'inde 405 (Method Not Allowed) hatası alınıyor.

## Olası Nedenler

1. **Netlify Build Hatası**: API route'ları düzgün build edilmemiş olabilir
2. **Environment Variables**: Supabase credentials eksik olabilir
3. **Netlify Plugin**: `@netlify/plugin-nextjs` düzgün çalışmıyor olabilir

## Çözüm Adımları

### 1. Netlify Build Loglarını Kontrol Et

1. **Netlify Dashboard** → **Deploys** → Son deploy'a tıkla
2. **Build log** → Hata var mı kontrol et
3. Özellikle şu hataları ara:
   - `Failed to build API route`
   - `Missing environment variable`
   - `Plugin error`

### 2. Environment Variables Kontrolü

Netlify Dashboard → **Environment variables** → Şunların olduğundan emin ol:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://shcxrmpqdbbfdwbqucij.supabase.co` (son `/` olmadan)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGc...` (anon key)

### 3. Yeni Deploy Yap

1. **Netlify Dashboard** → **Deploys** → **Trigger deploy** → **Deploy site**
2. Build'in başarılı olduğunu kontrol et
3. Deploy tamamlandıktan sonra siteyi test et

### 4. API Route'u Test Et

Tarayıcı console'unda veya Postman'de test et:

```javascript
// GET request
fetch('/api/site')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 5. Netlify Functions Loglarını Kontrol Et

1. **Netlify Dashboard** → **Functions** → **api-site** function'ına tıkla
2. **Logs** → Hata var mı kontrol et

## Alternatif Çözüm: API Route'u Kontrol Et

Eğer hala çalışmıyorsa, `src/app/api/site/route.ts` dosyasını kontrol et:

```typescript
// GET ve PUT metodları export edilmiş olmalı
export async function GET() { ... }
export async function PUT(request: Request) { ... }
```

## Netlify Plugin Kontrolü

`netlify.toml` dosyasında plugin'in olduğundan emin ol:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Son Çare: Netlify Support

Eğer yukarıdaki adımlar işe yaramazsa:
1. Netlify Dashboard → **Support** → **Contact support**
2. Build log'larını ve hata mesajını paylaş
