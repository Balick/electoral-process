import SearchCandidate from "@/components/search-candidate";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchProvider } from "@/context/search-candidate-provider";
import CandidateCard from "@/components/candidate-card";
import BlankButton from "@/components/blank-button";
import React from "react";
import {
  connectManager,
  getCandidates,
  getVoterById,
} from "@/lib/supabase/utils";
import Navigation from "@/components/navigation";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  await connectManager();

  const data = await getVoterById(params.id);
  const elector = data[0];

  if (elector.a_vote) {
    redirect("/center/identification");
  }

  const candidates = await getCandidates();

  return (
    <>
      <Navigation />
      <SearchProvider>
        <div className="min-h-screen lg:max-h-screen lg:overflow-hidden flex flex-col pt-16 px-8 bg-gray-100">
          <div className="py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-">
            <span className="font-semibold text-pink-700">
              Pour choisir votre candidat, touchez sur sa photo
            </span>
            <h1 className="text-cblue-light font-semibold text-xl">
              Election présidentiel
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-4">
              <span className="font-semibold text-pink-700">
                Pour vous abstenir,
                <br /> apppuyez sur le bouton &quot;VOTE BLANC&quot;
              </span>
              <BlankButton id={elector.identifiant} name={elector.nom} />
            </div>
          </div>

          <div className="grow overflow-y-scroll">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 place-items-center">
              {candidates?.map((candidate, idx) => (
                <CandidateCard data={candidate} elector={elector} key={idx} />
              ))}
            </div>
          </div>

          <div className="py-2 flex flex-col gap-4 md:flex-row justify-between md:items-center">
            <SearchCandidate />
            <Link replace href={"/center/identification"}>
              <Button className="w-full uppercase bg-pink-700 font-semibold tracking-wider hover:bg-pink-600 active:scale-105 transition-all duration-300">
                Annuler
              </Button>
            </Link>
          </div>
        </div>
      </SearchProvider>
    </>
  );
}
