"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResetData } from "@/lib/actions";
import { LoaderCircle, ThumbsUp } from "lucide-react";
import React, { useState } from "react";

export default function ResetBtn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpen2, setIsOpen2] = React.useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);

    await ResetData().then(() => {
      setIsSubmitting(false);
      setIsOpen(true);
    });
  };

  return (
    <Dialog open={isOpen2}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen2(true)}
          disabled={isSubmitting}
          className="bg-cred hover:bg-cred/70 transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg"
        >
          Réinitialiser les données
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogTitle className="lg:text-lg uppercase text-center">
          Réinitialiser les données
        </DialogTitle>
        <DialogDescription className="text-center lg:text-lg text-black">
          Etes-vous sûr de vouloir réinitialiser les données ? Toutes les
          valeurs des données présentes dans la base de données seront remises à
          leur état initial.
        </DialogDescription>
        <div className="flex gap-2 w-full justify-center">
          <Dialog open={isOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-600 font-semibold w-full h-10 lg:h-12 lg:text-xl transition-all duration-300"
              >
                {isSubmitting ? (
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
                Données réinitialisées
              </DialogTitle>
              <DialogDescription className="text-center lg:text-lg text-black">
                La réinitialisation des données a bien été effectuée.
              </DialogDescription>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  setIsOpen2(false);
                }}
                disabled={isSubmitting}
                className="bg-cblue font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-cblue-light transition-all duration-300"
              >
                Fermer
              </Button>
            </DialogContent>
          </Dialog>

          <DialogClose className="w-full" asChild>
            <Button
              disabled={isSubmitting}
              onClick={() => setIsOpen2(false)}
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
