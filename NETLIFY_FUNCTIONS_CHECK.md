# Netlify Functions Kontrol Rehberi

## Function Durumu

Netlify Dashboard'da **"Next.js Server Handler"** function'ı görünüyor - bu normal! Next.js API route'ları (`/api/*`) Netlify'da bu şekilde serverless function olarak çalışır.

---

## Function Loglarını Kontrol Et

### 1. Netlify Dashboard'dan

1. **Netlify Dashboard** → **Functions** → **Next.js Server Handler**
2. **Logs** sekmesine tıkla
3. Son çağrıları kontrol et:
   - `/api/site` GET request'leri görünmeli
   - `/api/site` PUT request'leri görünmeli
   - Hata var mı kontrol et

### 2. Real-time Log İzleme

Netlify CLI ile lokal test:
```bash
netlify dev
```

Bu komut:
- Lokal development server başlatır
- Function loglarını gösterir
- API route'larını test edebilirsiniz

---

## API Route Test Etme

### Tarayıcı Console'unda

```javascript
// GET test
fetch('/api/site')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// PUT test (admin panelinden yapılan değişiklik)
fetch('/api/site', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* site data */ })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## Sorun Giderme

### Function çalışmıyor
- Netlify Dashboard → **Deploys** → Son deploy'u kontrol et
- Build loglarında hata var mı bak
- Environment variables doğru mu kontrol et

### 405 hatası
- Function loglarında hata var mı kontrol et
- API route'unun `export const dynamic = 'force-dynamic'` olduğundan emin ol
- Yeni deploy yap

### Veri kaydedilmiyor
- Function loglarında PUT request görünüyor mu?
- Supabase credentials doğru mu?
- Supabase Dashboard → Logs → API calls kontrol et

---

## Function Detayları

**Function Adı:** `___netlify-server-handler`  
**Runtime:** Next.js Server Handler  
**Durum:** ✅ Aktif (production'da çalışıyor)

Bu function tüm Next.js API route'larını (`/api/*`) handle eder:
- `/api/site` → GET ve PUT
- `/api/admin/login` → POST

---

## Sonuç

Function aktif ve çalışıyor görünüyor. Eğer admin panelinde değişiklikler kaydedilmiyorsa:

1. Function loglarını kontrol et
2. Supabase credentials doğru mu kontrol et
3. Hard refresh yap (Ctrl+F5)
4. Tarayıcı console'unu kontrol et (F12)
