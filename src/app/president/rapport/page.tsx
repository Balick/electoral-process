"use client";

import LogOut from "@/app/admin/dashboard/_components/log-out";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ReportPage from "./Report";

export default function Page() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="relative">
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Rapport des elections
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <Button
            onClick={() => reactToPrintFn()}
            className="bg-cblue hover:bg-cblue/80 transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg"
          >
            Publier le rapport
          </Button>
          <LogOut />
        </div>
      </div>

      <ReportPage ref={contentRef} />
    </div>
  );
}
