import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - COREXE BEST",
  description: "COREXE BEST site yönetim paneli",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {children}
    </div>
  );
}
