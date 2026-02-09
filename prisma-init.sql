-- Vercel Prisma Postgres için site_data tablosu oluştur

-- Tablo oluştur
CREATE TABLE IF NOT EXISTS site_data (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlk veriyi ekle
INSERT INTO site_data (id, data)
VALUES ('main', '{
  "site": {
    "name": "COREXE BEST",
    "whatsapp": "+905527374558",
    "email": "corexe@best.com",
    "address": "İstanbul, Türkiye"
  },
  "sliders": [],
  "discountBanners": [],
  "products": [],
  "ucProducts": [],
  "socialLinks": [],
  "about": {
    "title": "Hakkımızda",
    "content": "COREXE BEST olarak oyun hesap satışı, UC satışı ve sosyal medya hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz."
  },
  "contact": {
    "title": "İletişim",
    "description": "Sorularınız için bize ulaşın.",
    "whatsapp": "+905527374558",
    "email": "corexe@best.com",
    "address": "İstanbul, Türkiye"
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Tabloyu kontrol et
SELECT id, updated_at, jsonb_pretty(data) as data FROM site_data WHERE id = 'main';
