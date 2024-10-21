import IdentificationForm from "@/components/manager-ui/identification-form";
import Image from "next/image";
import carte from "../../../../public/carte.jpg";
import Navigation from "@/components/navigation";
import React from "react";
import { connectManager } from "@/lib/supabase/utils";

export default async function Page() {
  await connectManager();

  return (
    <>
      <Navigation />
      <div className="min-h-screen lg:max-h-screen lg:overflow-hidden flex flex-col pt-16 px-8">
        <div className="grow flex items-center justify-center flex-col gap-8 lg:flex-row">
          <IdentificationForm />
          <div className="rounded-full overflow-hidden h-48 w-48 lg:fixed lg:right-8 lg:top-20">
            <Image
              src={carte}
              alt="Carte électorale"
              className="scale-[1.80] translate-y-8 translate-x-4"
            />
          </div>
        </div>
      </div>
    </>
  );
}
