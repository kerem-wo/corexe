import { createClient } from "@supabase/supabase-js";
import type { SiteData } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Falling back to file system.");
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const SITE_DATA_ID = "main";

export async function getSiteData(): Promise<SiteData | null> {
  if (!supabase) {
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
    const { data, error } = await supabase
      .from("site_data")
      .select("data")
      .eq("id", SITE_DATA_ID)
      .single();

    if (error) {
      console.error("Supabase get error:", error);
      return null;
    }

    return data?.data as SiteData | null;
  } catch (e) {
    console.error("Supabase get exception:", e);
    return null;
  }
}

export async function saveSiteData(siteData: SiteData): Promise<boolean> {
  if (!supabase) {
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
    const { error } = await supabase
      .from("site_data")
      .upsert({
        id: SITE_DATA_ID,
        data: siteData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Supabase save error:", error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Supabase save exception:", e);
    return false;
  }
}
