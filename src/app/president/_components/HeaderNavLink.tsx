"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardLinks = [
  {
    label: "Accueil",
    href: "/president/",
  },
  {
    label: "Rapport",
    href: "/president/rapport",
  },
  {
    label: "Résultats",
    href: "/result",
  },
];

export default function NavLinks() {
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
