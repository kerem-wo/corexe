// Vercel Prisma Postgres için veritabanı tablosunu oluştur
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL environment variable bulunamadı!');
  console.error('Lütfen .env.local dosyasında DATABASE_URL ekleyin.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initDatabase() {
  try {
    console.log('🔄 Veritabanına bağlanılıyor...');

    // Tablo oluştur
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_data (
        id TEXT PRIMARY KEY DEFAULT 'main',
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Tablo oluşturuldu: site_data');

    // İlk veriyi ekle
    const initialData = {
      site: {
        name: "COREXE BEST",
        whatsapp: "+905527374558",
        email: "corexe@best.com",
        address: "İstanbul, Türkiye"
      },
      sliders: [],
      discountBanners: [],
      products: [],
      ucProducts: [],
      socialLinks: [],
      about: {
        title: "Hakkımızda",
        content: "COREXE BEST olarak oyun hesap satışı, UC satışı ve sosyal medya hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz."
      },
      contact: {
        title: "İletişim",
        description: "Sorularınız için bize ulaşın.",
        whatsapp: "+905527374558",
        email: "corexe@best.com",
        address: "İstanbul, Türkiye"
      }
    };

    await pool.query(
      `INSERT INTO site_data (id, data)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      ['main', JSON.stringify(initialData)]
    );
    console.log('✅ İlk veri eklendi');

    // Kontrol et
    const result = await pool.query('SELECT id, updated_at FROM site_data WHERE id = $1', ['main']);
    if (result.rows.length > 0) {
      console.log('✅ Veritabanı hazır!');
      console.log('   ID:', result.rows[0].id);
      console.log('   Updated:', result.rows[0].updated_at);
    } else {
      console.warn('⚠️ Veri bulunamadı');
    }

  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
