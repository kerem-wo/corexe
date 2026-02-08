# COREXE BEST - Oyun Hesap, UC ve Sosyal Medya Satış Sitesi

Hesap.com.tr tarzında PUBG Mobile hesap satışı, UC satışı ve sosyal medya hesapları için modern, dark-blur tasarımlı site. GSAP animasyonları, slider, indirim bannerları, sepet ve WhatsApp iletişim entegrasyonu içerir.

## Özellikler

- **Ana sayfa:** Slider (reklam/kampanya), indirim bannerları, **Oyun Hesapları**, **UC Satışları**, **Sosyal Medya Hesapları** bölümleri, sepet
- **Dark-blur (glassmorphism)** arka plan ve bileşenler
- **GSAP** ile giriş ve hover animasyonları
- **Sepet:** Ürün ekleme, adet güncelleme, "Ödeme için iletişime geç" ile WhatsApp’a yönlendirme
- **WhatsApp mesajı:** Sepetteki ürün başlıkları otomatik eklenir:  
  `"[Ürün Başlığı] isimli hesap için iletişime geçiyorum yardımcı olur musunuz?"`
- **Hakkımızda** ve **İletişim** sayfaları
- **Admin paneli** (`/admin`): Site ayarları, slider, banner, oyun hesapları, **UC satışları**, **sosyal medya hesapları**, hakkımızda, iletişim içeriklerini güncelleme

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda: [http://localhost:3000](http://localhost:3000)

## Admin Paneli

- Adres: [http://localhost:3000/admin](http://localhost:3000/admin)
- Varsayılan şifre: `admin123`
- Şifreyi değiştirmek için `.env.local` dosyası oluşturup `ADMIN_PASSWORD=your_password` ekleyin.

Admin’den yapılabilecekler:

- **Site ayarları:** Site adı (COREXE BEST), WhatsApp numarası, e-posta, adres
- **Slider:** Ana sayfa slider öğeleri (başlık, görsel URL, link, sıra)
- **İndirim bannerları:** Reklam/indirim kartları
- **Oyun Hesapları:** PUBG Mobile vb. hesap ilanları (başlık, fiyat, görsel, açıklama, kategori, sıra)
- **UC Satışları:** UC paketleri (başlık, fiyat, görsel, açıklama, kategori, sıra)
- **Sosyal Medya Hesapları:** Instagram, TikTok, YouTube vb. (başlık, fiyat, görsel, açıklama, kategori, sıra)
- **Hakkımızda:** Başlık ve metin
- **İletişim:** Başlık, açıklama, WhatsApp, e-posta, adres

Tüm içerik `src/data/site-data.json` dosyasında saklanır ve admin üzerinden güncellenir.

## WhatsApp Numarası

Site ayarlarındaki WhatsApp numarası 90 ile başlamalı (örn: `905527374558`). Sepette "Ödeme için iletişime geç" tıklandığında bu numaraya yönlendirilir ve mesaj otomatik doldurulur.

## Görseller

Slider ve ürün görselleri için `public/images/` klasörüne dosyalar ekleyebilir veya admin panelinden tam URL girebilirsiniz. Görsel yoksa gradient/placeholder kullanılır.

## Teknolojiler

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 4
- GSAP 3
- TypeScript
