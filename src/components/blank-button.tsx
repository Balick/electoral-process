"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { blankVote } from "@/lib/supabase/utils";
import { LoaderCircle, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

export default function BlankButton({
  id,
  name,
  center,
}: {
  id: string;
  name: string;
  center: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    await blankVote(id).then(() => {
      setIsLoading(false);
      setIsOpen(true);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-max uppercase bg-pink-700 font-semibold tracking-wider hover:bg-pink-600 active:scale-105 transition-all duration-300">
          vote blanc
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogTitle className="lg:text-lg uppercase text-center">
          Voter blanc
        </DialogTitle>
        <DialogDescription className="text-center lg:text-lg text-black">
          Etes-vous sûr de vouloir voter blanc ? Votre vote blanc sera
          enregistré mais ne sera pas comptabilisé dans le calcul du résultat.
        </DialogDescription>
        <div className="flex gap-2 w-full justify-center">
          <Dialog open={isOpen}>
            <DialogTrigger asChild>
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
                Vous avez voté blanc
              </DialogTitle>
              <DialogDescription className="text-center lg:text-lg text-black">
                Merci <span className="font-semibold">{name}</span> pour votre
                participation.
              </DialogDescription>
              <Button
                onClick={() =>
                  router.replace(`/center/${center}/identification`)
                }
                disabled={isLoading}
                className="bg-cblue font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-cblue-light transition-all duration-300"
              >
                Continuer
              </Button>
            </DialogContent>
          </Dialog>

          <DialogClose className="w-full" asChild>
            <Button
              disabled={isLoading}
              className="bg-red-700 font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-red-600 transition-all duration-300"
            >
              Annuler
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
