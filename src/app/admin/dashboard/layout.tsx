import { ReactNode } from "react";
import HeaderDashboard from "@/app/admin/dashboard/header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen w-full p-8 pt-20">
      <HeaderDashboard />
      <div className="min-h-[84vh]">
        {children}
      </div>
    </main>
  );
}
