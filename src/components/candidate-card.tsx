"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Candidate, images } from "@/constants";
import { useSearchCandidate } from "@/context/search-candidate-provider";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import ConfirmButton from "./confirm-button";

export default function CandidateCard({
  data,
  elector,
  center,
}: {
  data: Candidate;
  elector: any[];
  center: string;
}) {
  const { term } = useSearchCandidate();
  const imagesData = images.find((image) => image.numero === data.numero);

  return data.nom.toLowerCase().includes(term.toLowerCase()) ||
    data.numero === Number(term) ? (
    <Dialog>
      <DialogTrigger>
        <div className="bg-white w-max p-1">
          <div className="flex">
            <div className="relative w-40 h-40">
              {imagesData && (
                <Image
                  src={imagesData.image}
                  alt={`Photo du candidat ${data.nom}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              )}
            </div>
            <div className="w-40 h-40 relative flex items-center justify-center">
              <span className="block bg-pink-700 text-white font-semibold text-center absolute top-0 inset-x-0">
                {data.numero}
              </span>
              {imagesData && (
                <Image
                  src={imagesData.partyLogo}
                  alt={`Logo du parti ${data.partie}`}
                  width={100}
                  height={100}
                  className="mt-4 w-auto h-auto"
                />
              )}
            </div>
          </div>
          <span className="text-center block mt-2 font-semibold">
            {data.nom}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        title={`Votez pour ${data.nom}`}
        className="bg-white flex flex-col items-center justify-center max-w-none w-max"
      >
        <DialogTitle>Votez pour {data.nom}</DialogTitle>
        <DialogDescription className="sr-only">
          Confirmer le vote pour {data.nom}
        </DialogDescription>
        <div className="w-max p-1">
          <div className="flex">
            <div className="relative w-40 h-40 lg:w-72 lg:h-72">
              {imagesData && (
                <Image
                  src={imagesData.image}
                  alt={`Photo du candidat ${data.nom}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
            <div className="w-40 h-40 lg:w-72 lg:h-72 relative flex items-center justify-center">
              <span className="block lg:text-2xl bg-pink-700 text-white font-semibold text-center absolute top-0 inset-x-0 z-20">
                {data.numero}
              </span>
              {imagesData && (
                <Image
                  src={imagesData.partyLogo}
                  alt={`Logo du parti ${data.partie}`}
                  width={130}
                  height={130}
                  className="mt-4 scale-75 lg:scale-100 w-auto h-auto"
                />
              )}
            </div>
          </div>
          <span className="text-center block mt-2 font-semibold lg:text-2xl">
            {data.nom}
          </span>
        </div>
        <ConfirmButton center={center} data={data} elector={elector} />
      </DialogContent>
    </Dialog>
  ) : null;
}
