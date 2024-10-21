import Image from "next/image";
import { Play } from "lucide-react";
import ceniLogo from "../../../public/ceni-logo.png";
import InteractiveButtons from "@/components/manager-ui/interactive-buttons";
import Navigation from "@/components/navigation";
import React from "react";
import { signOut } from "@/lib/actions";
import { connectManager } from "@/lib/supabase/utils";

export default async function Home() {
  const user = await connectManager();

  const localisation = {
    province: "Haut Katanga",
    ville: "Lubumbashi",
    commune: "Kampemba",
    quartier: "Bel-air",
    avenue: "Fungurumé",
  };

  const renderLocalisation = () => {
    return (
      <ul className="flex gap-1 w-full justify-center flex-wrap">
        {Object.entries(localisation).map(([key, value], idx) => (
          <li key={key} className="flex items-center gap-1">
            <span className="text-nowrap">{value}</span>
            {idx != Object.entries(localisation).length - 1 && (
              <Play className="fill-slate-950 text-slate-950 w-3 h-3" />
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen lg:max-h-screen lg:overflow-hidden flex flex-col py-16">
        <div className="flex items-center flex-col">
          <div className="py-4 bg-gray-200 px-8 w-full uppercase text-cblue-light space-y-4 font-semibold">
            {renderLocalisation()}
            <div className="space-y-1">
              <h4 className="text-black text-center">élections fixées</h4>
              <ul>
                <li className="flex flex-col text-center">
                  <span>élection présidentielle</span>
                  <span>élections législatives nationales</span>
                  <span>élections législatives provinciales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <form action={signOut} className=" py-2 px-8 text-cred font-semibold">
          <button type="submit">Se déconnecter</button>
        </form>

        <div className="flex flex-col lg:flex-row grow">
          <div className="flex items-center justify-center lg:basis-1/2 px-8">
            <Image
              src={ceniLogo}
              alt="Logo de la CENI"
              className="lg:w-[40rem]"
              priority
            />
          </div>

          <div className="pt-20 px-8 flex items-center justify-center lg:basis-1/2">
            <InteractiveButtons />
          </div>
        </div>
      </div>
    </>
  );
}
