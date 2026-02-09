import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/supabase";
import type { SiteData } from "@/lib/types";

export async function GET() {
  try {
    const data = await getSiteData();
    if (!data) {
      return NextResponse.json({ error: "Veri okunamadı" }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Veri okunamadı" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as SiteData;
    const success = await saveSiteData(body);
    if (!success) {
      return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Kayıt başarısız" }, { status: 500 });
  }
}
