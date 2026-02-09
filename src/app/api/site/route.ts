import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/postgres";
import type { SiteData } from "@/lib/types";

// API route'unun dynamic olmasını zorunlu kıl
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await getSiteData();
    if (!data) {
      return NextResponse.json({ error: "Veri okunamadı" }, { status: 500 });
    }
    // Cache'i tamamen devre dışı bırak - her zaman fresh data
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
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
