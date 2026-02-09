"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = sessionStorage.getItem("admin_token");
    const email = sessionStorage.getItem("admin_email");
    
    // Token ve email kontrolü - ikisi de olmalı
    if (!token || !email) {
      router.replace("/admin");
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
