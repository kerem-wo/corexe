-- COREXE BEST - Supabase Veritabanı Kurulum Script'i
-- Bu script'i Supabase Dashboard > SQL Editor'de çalıştır

-- 1. site_data tablosu oluştur
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. İlk veriyi ekle (JSON string'i escape edilmiş şekilde)
INSERT INTO site_data (id, data)
VALUES ('main', '{"site":{"name":"COREXE BEST","whatsapp":"+905527374558","email":"corexe@best.com","address":"İstanbul, Türkiye"},"sliders":[{"id":"1","title":"COREXE BEST SATIŞ","subtitle":"HESAP SATIŞI","description":"Güvenilir PUBG Mobile hesapları ve UC satışı en uygun fiyatlarla!","image":"/images/slider-pubg.jpg","link":"/#urunler","order":1},{"id":"2","title":"ÖZEL KAMPANYA","subtitle":"İNDİRİMLİ HESAPLAR","description":"Seçili hesaplarda sınırlı süre indirim.","image":"/images/slider-kampanya.jpg","link":"/#urunler","order":2}],"discountBanners":[{"id":"1","title":"PUBG MOBILE","subtitle":"İNDİRİMLİ HESAPLAR","discount":"%15","image":"/images/banner-pubg.jpg","link":"/#urunler","order":1},{"id":"2","title":"YENİ HESAPLAR","subtitle":"ERKEN ALAN KAZANSIN","discount":"%10","image":"/images/banner-yeni.jpg","link":"/#urunler","order":2}],"products":[{"id":"1","title":"PUBG Mobile Orta Seviye Hesap","price":450,"image":"/images/product-pubg1.jpg","description":"Seviye 45+, 20+ skin, güvenli teslimat.","category":"PUBG Mobile","featured":true,"order":1},{"id":"2","title":"PUBG Mobile Premium Hesap","price":1200,"image":"/images/product-pubg2.jpg","description":"Seviye 70+, Royale Pass, nadir skinler.","category":"PUBG Mobile","featured":true,"order":2},{"id":"3","title":"PUBG Mobile UC Dolu Hesap","price":350,"image":"/images/product-pubg3.jpg","description":"2000+ UC yüklü, anında teslimat.","category":"PUBG Mobile","featured":false,"order":3}],"ucProducts":[{"id":"uc1","title":"PUBG Mobile 60 UC","price":25,"image":"/images/uc-60.jpg","description":"60 UC, anında teslimat.","category":"PUBG Mobile UC","featured":true,"order":1},{"id":"uc2","title":"PUBG Mobile 325 UC","price":125,"image":"/images/uc-325.jpg","description":"325 UC paketi, güvenli ödeme.","category":"PUBG Mobile UC","featured":true,"order":2},{"id":"uc3","title":"PUBG Mobile 660 UC","price":250,"image":"/images/uc-660.jpg","description":"660 UC paketi, hızlı teslimat.","category":"PUBG Mobile UC","featured":false,"order":3}],"socialLinks":[{"id":"sl1","platform":"Instagram","url":"https://instagram.com/corexebest","order":1},{"id":"sl2","platform":"TikTok","url":"https://tiktok.com/@corexebest","order":2},{"id":"sl3","platform":"YouTube","url":"https://youtube.com/@corexebest","order":3}],"about":{"title":"Hakkımızda","content":"COREXE BEST olarak oyun hesap satışı, UC satışı ve sosyal medya hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz. PUBG Mobile hesapları, UC paketleri ve sosyal medya hesaplarınızı güvenle alıp satabilirsiniz. Müşteri memnuniyeti önceliğimizdir."},"contact":{"title":"İletişim","description":"Sorularınız için bize ulaşın.","whatsapp":"+905527374558","email":"corexe@best.com","address":"İstanbul, Türkiye"}}'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  data = EXCLUDED.data,
  updated_at = NOW();

-- 3. Row Level Security (RLS) ayarları
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (anon key ile)
CREATE POLICY "Allow public read access" ON site_data
  FOR SELECT
  USING (true);

-- Herkes yazabilir (anon key ile) - Güvenlik için service role key kullanmanız önerilir
CREATE POLICY "Allow public write access" ON site_data
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access" ON site_data
  FOR UPDATE
  USING (true);

-- 4. Veriyi kontrol et
SELECT id, updated_at, jsonb_pretty(data) as data FROM site_data WHERE id = 'main';

-- 5. Tablo oluşturuldu ve veriler eklendi!
-- Artık admin panelinden yapılan değişiklikler Supabase'de kalıcı olarak saklanacak.
