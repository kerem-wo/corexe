# Supabase Anon Key Nasıl Alınır?

## Adım Adım Talimatlar

### 1. Supabase Dashboard'a Giriş Yap

1. Tarayıcıda [https://supabase.com](https://supabase.com) adresine git
2. **Sign In** → Giriş yap
3. Projenizi seçin: `shcxrmpqdbbfdwbqucij` (veya proje adınız)

### 2. API Settings'e Git

1. Sol menüden **Settings** (⚙️) ikonuna tıkla
2. **API** sekmesine tıkla

### 3. Anon Key'i Kopyala

**Project API keys** bölümünde iki key göreceksiniz:

- **`anon` `public`** → Bu key'i kullanacaksınız (güvenli, public)
- **`service_role` `secret`** → Bu key'i kullanmayın (güvenlik riski)

**`anon` `public`** key'in yanındaki **kopyala** (📋) butonuna tıkla.

### 4. Key Formatı

Anon key genellikle şu formatta olur:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY3hybXBxZGJiZmR3YnF1Y2lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA5ODk2MDAsImV4cCI6MjAyNjU2NTYwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Önemli:** Key çok uzun bir string olacak (200+ karakter).

---

## Netlify'da Kullanım

1. **Netlify Dashboard** → **corexe-best** sitesi
2. **Site configuration** → **Environment variables**
3. **Add a variable** → 
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Kopyaladığınız anon key'i yapıştır
4. **Save**

---

## Yerel Geliştirme İçin

`.env.local` dosyasına ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://shcxrmpqdbbfdwbqucij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Görsel Yardım

Supabase Dashboard'da şu yolu takip edin:

```
Dashboard → Settings (⚙️) → API → Project API keys → anon public → Copy
```

---

## Notlar

- ✅ **anon public** key güvenlidir - frontend'de kullanılabilir
- ❌ **service_role secret** key'i asla frontend'de kullanmayın
- 🔒 Anon key sadece RLS (Row Level Security) politikalarına göre çalışır
- 📋 Key'i kopyaladıktan sonra `.env.local` ve Netlify'a eklemeyi unutmayın
