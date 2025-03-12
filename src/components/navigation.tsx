"use client";

import Timer from "@/app/admin/dashboard/_components/timer";
import DateTime from "@/components/date-time";

export default function Navigation({
  hiddenTimer,
  centerName,
}: {
  hiddenTimer?: boolean;
  centerName: string;
}) {
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
          {!hiddenTimer ? (
            <li>
              <Timer className="inline text-lg" />
            </li>
          ) : (
            <li>
              <DateTime />
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
