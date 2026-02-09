import { neon } from "@neondatabase/serverless";
import type { SiteData } from "./types";

const databaseUrl = process.env.DATABASE_URL || "";

// Neon client oluştur
const sql = databaseUrl ? neon(databaseUrl) : null;

const SITE_DATA_ID = "main";

export async function getSiteData(): Promise<SiteData | null> {
  if (!sql) {
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
    const result = await sql`
      SELECT data FROM site_data WHERE id = ${SITE_DATA_ID} LIMIT 1
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0].data as SiteData;
  } catch (e) {
    console.error("Neon get error:", e);
    return null;
  }
}

export async function saveSiteData(siteData: SiteData): Promise<boolean> {
  if (!sql) {
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
    await sql`
      INSERT INTO site_data (id, data, updated_at)
      VALUES (${SITE_DATA_ID}, ${JSON.stringify(siteData)}::jsonb, NOW())
      ON CONFLICT (id) 
      DO UPDATE SET 
        data = EXCLUDED.data,
        updated_at = NOW()
    `;

    return true;
  } catch (e) {
    console.error("Neon save error:", e);
    return false;
  }
}
