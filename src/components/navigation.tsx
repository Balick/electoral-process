"use client";

import Timer from "@/app/admin/dashboard/components/timer";

export default function Navigation() {
  const centerName = "Mapassa";

  return (
    <div className="bg-cblue text-white px-8 py-4 fixed inset-x-0 top-0 z-10">
      <nav>
        <ul className="flex items-center justify-between font-semibold uppercase">
          <li>
            <span>Centre {centerName}</span>
          </li>
          <li>
            <header className="uppercase text-2xl font-bold">CENI</header>
          </li>
          <li>
            <Timer className="inline text-lg" />
          </li>
        </ul>
      </nav>
    </div>
  );
}
