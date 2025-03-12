import { ReactNode } from "react";
import HeaderDashboard from "@/app/admin/dashboard/_components/header";
import { connectAdmin } from "@/lib/supabase/utils";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connectAdmin();

  return (
    <main className="relative min-h-screen w-full p-8 pt-20">
      <HeaderDashboard />
      <div className="min-h-[84vh]">{children}</div>
    </main>
  );
}
