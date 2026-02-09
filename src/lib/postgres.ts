import { Pool } from "pg";
import type { SiteData } from "./types";

// PostgreSQL connection string (Supabase PostgreSQL veya başka bir PostgreSQL servisi)
const databaseUrl = process.env.DATABASE_URL || "";

// PostgreSQL connection pool oluştur
let pool: Pool | null = null;

if (databaseUrl) {
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // Supabase ve çoğu cloud PostgreSQL için gerekli
      },
      max: 1, // Serverless ortamlar için connection pool'u küçük tut
    });
  } catch (e) {
    console.error("PostgreSQL pool oluşturulamadı:", e);
  }
}

const SITE_DATA_ID = "main";

export async function getSiteData(): Promise<SiteData | null> {
  if (!pool) {
    // Fallback: read from file
    try {
      const { promises: fs } = await import("fs");
      const path = await import("path");
      const dataPath = path.join(process.cwd(), "src/data/site-data.json");
      const data = await fs.readFile(dataPath, "utf-8");
      const parsed = JSON.parse(data) as SiteData;
      return {
        ...parsed,
        ucProducts: parsed.ucProducts ?? [],
        socialLinks: parsed.socialLinks ?? [],
      };
    } catch {
      return null;
    }
  }

  try {
    const result = await pool.query(
      "SELECT data FROM site_data WHERE id = $1 LIMIT 1",
      [SITE_DATA_ID]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].data as SiteData;
  } catch (e) {
    console.error("PostgreSQL get error:", e);
    return null;
  }
}

export async function saveSiteData(siteData: SiteData): Promise<boolean> {
  if (!pool) {
    // Fallback: write to file
    try {
      const { promises: fs } = await import("fs");
      const path = await import("path");
      const dataPath = path.join(process.cwd(), "src/data/site-data.json");
      await fs.writeFile(dataPath, JSON.stringify(siteData, null, 2), "utf-8");
      return true;
    } catch {
      return false;
    }
  }

  try {
    await pool.query(
      `INSERT INTO site_data (id, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (id) 
       DO UPDATE SET 
         data = EXCLUDED.data,
         updated_at = NOW()`,
      [SITE_DATA_ID, JSON.stringify(siteData)]
    );

    return true;
  } catch (e) {
    console.error("PostgreSQL save error:", e);
    return false;
  }
}
