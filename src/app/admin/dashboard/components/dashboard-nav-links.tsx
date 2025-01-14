"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const dashboardLinks = [
  {
    label: "Vue d'ensemble",
    href: "/admin/dashboard",
  },
  {
    label: "Centres",
    href: "/admin/dashboard/centres",
  },
  {
    label: "Gestion des comptes",
    href: "/admin/dashboard/gestion-comptes",
  },
];

export default function DashboardNavLinks() {
  const pathname = usePathname();
  return (
    <ul className="hidden lg:flex items-center justify-between font-medium gap-4">
      {dashboardLinks.map(({ label, href }, idx) => {
        const isActiveLink = pathname.endsWith(href);
        return (
          <li key={idx}>
            <Link href={href} className={cn(isActiveLink && "font-semibold")}>
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
