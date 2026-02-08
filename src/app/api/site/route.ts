import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { SiteData } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "src/data/site-data.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(data) as SiteData;
    const normalized: SiteData = {
      ...parsed,
      ucProducts: parsed.ucProducts ?? [],
      socialLinks: parsed.socialLinks ?? [],
    };
    return NextResponse.json(normalized);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Veri okunamadı" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
