import { NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@corexe.best";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Email ve şifre kontrolü
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "E-posta ve şifre gereklidir." }, { status: 400 });
    }
    
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Geçerli bir e-posta adresi giriniz." }, { status: 400 });
    }
    
    // Email ve şifre doğrulama
    if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() && password === ADMIN_PASSWORD) {
      const token = "admin-" + Buffer.from(email + password + Date.now()).toString("base64").slice(0, 32);
      return NextResponse.json({ 
        success: true, 
        token,
        email: email.toLowerCase().trim()
      });
    }
    
    return NextResponse.json({ success: false, error: "E-posta veya şifre hatalı." }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 400 });
  }
}
