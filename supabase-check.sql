-- COREXE BEST - Supabase Veri Kontrol Script'i
-- Bu script'i Supabase Dashboard > SQL Editor'de çalıştırarak veriyi kontrol edebilirsiniz

-- Veriyi kontrol et
SELECT id, updated_at, jsonb_pretty(data) as data FROM site_data WHERE id = 'main';

-- Sadece veri içeriğini görmek için (daha okunabilir)
SELECT data FROM site_data WHERE id = 'main';

-- Tablo yapısını kontrol et
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'site_data';
