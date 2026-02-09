// Vercel Prisma Postgres için veritabanını temizle ve sıfırdan kur
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

async function resetDatabase() {
  try {
    console.log('🔄 Veritabanına bağlanılıyor...');

    // 1. Tabloyu sil (varsa)
    console.log('🗑️  Eski tablo siliniyor...');
    await pool.query('DROP TABLE IF EXISTS site_data CASCADE;');
    console.log('✅ Eski tablo silindi');

    // 2. Tabloyu sıfırdan oluştur
    console.log('📦 Yeni tablo oluşturuluyor...');
    await pool.query(`
      CREATE TABLE site_data (
        id TEXT PRIMARY KEY DEFAULT 'main',
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ Tablo oluşturuldu: site_data');

    // 3. İlk veriyi ekle (COREXE BEST default data)
    console.log('📝 İlk veri ekleniyor...');
    const initialData = {
      site: {
        name: "COREXE BEST",
        whatsapp: "+905527374558",
        email: "corexe@best.com",
        address: "İstanbul, Türkiye"
      },
      sliders: [
        {
          id: "1",
          title: "COREXE BEST SATIŞ",
          subtitle: "HESAP SATIŞI",
          description: "Güvenilir PUBG Mobile hesapları ve UC satışı en uygun fiyatlarla!",
          image: "/images/slider-pubg.jpg",
          link: "/#urunler",
          order: 1
        },
        {
          id: "2",
          title: "ÖZEL KAMPANYA",
          subtitle: "İNDİRİMLİ HESAPLAR",
          description: "Seçili hesaplarda sınırlı süre indirim.",
          image: "/images/slider-kampanya.jpg",
          link: "/#urunler",
          order: 2
        }
      ],
      discountBanners: [
        {
          id: "1",
          title: "PUBG MOBILE",
          subtitle: "İNDİRİMLİ HESAPLAR",
          discount: "%15",
          image: "/images/banner-pubg.jpg",
          link: "/#urunler",
          order: 1
        },
        {
          id: "2",
          title: "YENİ HESAPLAR",
          subtitle: "ERKEN ALAN KAZANSIN",
          discount: "%10",
          image: "/images/banner-yeni.jpg",
          link: "/#urunler",
          order: 2
        }
      ],
      products: [
        {
          id: "1",
          title: "PUBG Mobile Orta Seviye Hesap",
          price: 150,
          image: "/images/product-1.jpg",
          description: "Seviye 30+, iyi ekipmanlar, güvenilir hesap.",
          category: "PUBG Mobile",
          featured: true,
          order: 1
        },
        {
          id: "2",
          title: "PUBG Mobile Yüksek Seviye Hesap",
          price: 300,
          image: "/images/product-2.jpg",
          description: "Seviye 50+, nadir skinler, premium hesap.",
          category: "PUBG Mobile",
          featured: true,
          order: 2
        },
        {
          id: "3",
          title: "PUBG Mobile Başlangıç Hesabı",
          price: 75,
          image: "/images/product-3.jpg",
          description: "Yeni başlayanlar için ideal hesap.",
          category: "PUBG Mobile",
          featured: false,
          order: 3
        }
      ],
      ucProducts: [
        {
          id: "uc1",
          title: "PUBG Mobile 100 UC",
          price: 25,
          image: "/images/uc-100.jpg",
          description: "100 UC paketi - Hızlı teslimat.",
          category: "PUBG Mobile UC",
          featured: false,
          order: 1
        },
        {
          id: "uc2",
          title: "PUBG Mobile 500 UC",
          price: 100,
          image: "/images/uc-500.jpg",
          description: "500 UC paketi - En popüler paket.",
          category: "PUBG Mobile UC",
          featured: true,
          order: 2
        },
        {
          id: "uc3",
          title: "PUBG Mobile 1000 UC",
          price: 180,
          image: "/images/uc-1000.jpg",
          description: "1000 UC paketi - En iyi fiyat.",
          category: "PUBG Mobile UC",
          featured: true,
          order: 3
        }
      ],
      socialLinks: [
        {
          id: "social1",
          platform: "Instagram",
          url: "https://instagram.com/corexebest",
          order: 1
        },
        {
          id: "social2",
          platform: "TikTok",
          url: "https://tiktok.com/@corexebest",
          order: 2
        },
        {
          id: "social3",
          platform: "YouTube",
          url: "https://youtube.com/@corexebest",
          order: 3
        }
      ],
      about: {
        title: "Hakkımızda",
        content: "COREXE BEST olarak oyun hesap satışı, UC satışı ve sosyal medya hizmetlerinde güvenilir ve hızlı çözümler sunuyoruz.\n\nYıllardır sektörde tecrübeli ekibimizle, müşterilerimize en kaliteli hizmeti sunmak için çalışıyoruz. Tüm hesaplarımız güvenli ve garantilidir.\n\nMüşteri memnuniyeti bizim için önceliktir. 7/24 destek hattımızla her zaman yanınızdayız."
      },
      contact: {
        title: "İletişim",
        description: "Sorularınız için bize ulaşın. 7/24 destek hattımızla hizmetinizdeyiz.",
        whatsapp: "+905527374558",
        email: "corexe@best.com",
        address: "İstanbul, Türkiye"
      }
    };

    await pool.query(
      `INSERT INTO site_data (id, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())`,
      ['main', JSON.stringify(initialData)]
    );
    console.log('✅ İlk veri eklendi');

    // 4. Kontrol et
    const result = await pool.query('SELECT id, updated_at, jsonb_pretty(data) as data FROM site_data WHERE id = $1', ['main']);
    if (result.rows.length > 0) {
      console.log('\n✅ Veritabanı sıfırdan kuruldu ve hazır!');
      console.log('   ID:', result.rows[0].id);
      console.log('   Updated:', result.rows[0].updated_at);
      console.log('\n📊 İçerik Özeti:');
      const data = JSON.parse(JSON.stringify(initialData));
      console.log(`   - Site Adı: ${data.site.name}`);
      console.log(`   - Slider: ${data.sliders.length} adet`);
      console.log(`   - Banner: ${data.discountBanners.length} adet`);
      console.log(`   - Ürünler: ${data.products.length} adet`);
      console.log(`   - UC Ürünleri: ${data.ucProducts.length} adet`);
      console.log(`   - Sosyal Medya: ${data.socialLinks.length} adet`);
      console.log('\n🎉 Artık admin panelinden tüm içerikleri yönetebilirsiniz!');
      console.log('   Site otomatik olarak güncellenecek.');
    } else {
      console.warn('⚠️ Veri bulunamadı');
    }

  } catch (error) {
    console.error('❌ Hata:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
