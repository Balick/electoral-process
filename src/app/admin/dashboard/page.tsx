import { DateTimeForm } from "@/app/admin/dashboard/components/datetime-form";
import { connectAdmin } from "@/lib/supabase/utils";
import { Hourglass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ceniLogo from "../../../../public/ceni-logo.png";
import LogOut from "./components/log-out";
import ResetBtn from "./components/reset-btn";
import Timer from "./components/timer";
import TotalVoters from "./components/total-voters";
import VotingCenters from "./components/voting-centers";
import WhiteVotes from "./components/white-votes";

export default async function Page() {
  await connectAdmin();

  return (
    <div>
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Vue d&apos;ensemble
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <button className="hidden bg-cblue hover:bg-cblue-light text-white hover:text-black transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg">
            Générer le rapport
          </button>
          <ResetBtn />
          <LogOut />
        </div>
      </div>

      <div className="flex justify-between gap-8 mt-4 flex-wrap md:flex-nowrap">
        <TotalVoters />
        <VotingCenters />
        <WhiteVotes />
        <div className="w-full border border-black rounded-lg p-4 ">
          <div className="flex justify-between items-center gap-2">
            <span className="text-nowrap">Temps restant</span>
            <Hourglass className="w-4 h-4" />
          </div>
          <Timer />
          <span className="text-sm -mt-1 block">sur 24h</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex items-center justify-center lg:basis-1/2 px-8">
          <Image
            src={ceniLogo}
            alt="Logo de la CENI"
            className="lg:w-[40rem]"
            priority
          />
        </div>

        <div className="pt-20 px-8 flex flex-col items-center justify-center lg:basis-1/2">
          <DateTimeForm />
          <Link
            href="/result"
            target="_blank"
            className="w-full text-lg text-center mt-2 underline"
          >
            Voir les votes en temps réel
          </Link>
        </div>
      </div>

      {/*
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <BarWinner/>
        <CandidateList/>
      </div>
      */}
    </div>
  );
}
