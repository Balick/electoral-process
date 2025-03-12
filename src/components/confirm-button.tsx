"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Candidate } from "@/constants";
import { vote } from "@/lib/supabase/utils";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { LoaderCircle, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

export default function ConfirmButton({
  data,
  elector,
  center,
}: {
  data: Candidate;
  elector: any;
  center: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    await vote(data.id, elector.id_centre, elector.id).then(() => {
      setIsLoading(false);
      setIsOpen(true);
    });
  };

  return (
    <div className="flex gap-2 w-full justify-center">
      <Dialog open={isOpen}>
        <DialogTrigger className="w-full" asChild>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-700 font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-green-600 transition-all duration-300"
          >
            {isLoading ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <div className="w-max mx-auto bg-slate-100 rounded-full p-3">
            <ThumbsUp className="text-cblue fill-cblue-light/50 w-8 h-8" />
          </div>
          <DialogTitle className="lg:text-lg uppercase text-center">
            Vous avez voté pour <b>{data.nom}</b>
          </DialogTitle>
          <DialogDescription className="text-center lg:text-lg text-black">
            Merci <span className="font-semibold uppercase">{elector.nom}</span>{" "}
            pour votre participation.
          </DialogDescription>
          <Button
            onClick={() => router.replace(`/center/${center}/identification`)}
            className="bg-cblue font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-cblue-light transition-all duration-300"
          >
            Continuer
          </Button>
        </DialogContent>
      </Dialog>

      <DialogClose
        disabled={isLoading}
        className="text-white bg-red-700 font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-red-600 transition-all duration-300 rounded-lg"
      >
        Annuler
      </DialogClose>
    </div>
  );
}
