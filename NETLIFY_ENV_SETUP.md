# Netlify Environment Variables Kurulumu

Supabase entegrasyonu için Netlify'da environment variables eklemeniz gerekiyor.

---

## Netlify Dashboard'da Ayarlar

1. **Netlify Dashboard** → **corexe-best** sitesine git
2. **Site configuration** → **Environment variables** → **Add a variable**

### Eklenmesi Gereken Değişkenler:

#### 1. Supabase URL
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://shcxrmpqdbbfdwbqucij.supabase.co`

#### 2. Supabase Anon Key
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `sb_publishable_UPfmSk5-PgYXC8Nm4OBWZw_cffGfAwJ`

#### 3. Admin Email (Opsiyonel)
- **Key:** `ADMIN_EMAIL`
- **Value:** `admin@corexe.best` (veya istediğiniz email)

#### 4. Admin Password (Opsiyonel)
- **Key:** `ADMIN_PASSWORD`
- **Value:** `admin123` (veya istediğiniz şifre)

---

## Supabase Veritabanı Kurulumu

1. **Supabase Dashboard** → [https://shcxrmpqdbbfdwbqucij.supabase.co](https://shcxrmpqdbbfdwbqucij.supabase.co)
2. Sol menü → **SQL Editor**
3. **New query** → `supabase-init.sql` dosyasının içeriğini yapıştır
4. **Run** (veya F5) → Tablo oluşturuldu ve ilk veriler eklendi

---

## Deploy

Environment variables ekledikten sonra:

1. Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**
2. Veya GitHub'a push yaparak otomatik deploy tetiklenir

---

## Notlar

- Environment variables ekledikten sonra **mutlaka yeni bir deploy** yapın
- Supabase anon key formatı doğru değilse, Supabase Dashboard → **Settings** → **API** → **anon public** key'i kopyalayın
- Admin panelinden yapılan tüm değişiklikler artık Supabase'de kalıcı olarak saklanacak
