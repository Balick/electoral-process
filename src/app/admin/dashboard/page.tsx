import { DateTimeForm } from "@/app/admin/dashboard/components/datetime-form";
import { connectAdmin } from "@/lib/supabase/utils";
import { Hourglass } from "lucide-react";
import { BarWinner } from "./components/bar-winner";
import CandidateList from "./components/candidate-list";
import LogOut from "./components/log-out";
import Timer from "./components/timer";
import TotalVoters from "./components/total-voters";
import VotingCenters from "./components/voting-centers";
import WhiteVotes from "./components/white-votes";

export default async function Page() {
  // Verify if connected user is admin
  await connectAdmin();

  return (
    <div>
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Vue d&apos;ensemble
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <button className="bg-cblue hover:bg-cblue-light text-white hover:text-black transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg">
            Générer le rapport
          </button>
          <LogOut />
          <DateTimeForm />
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
        <BarWinner />
        <CandidateList />
      </div>
    </div>
  );
}
