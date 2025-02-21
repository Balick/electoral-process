"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimerOff } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

export default function DialogRedirectMsg({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = React.useState(open);

  const handleClose = () => {
    // Supprimer le paramètre 'sessionEnd' de l'URL
    const url = new URL(window.location.href);
    url.searchParams.delete("sessionEnd");
    window.history.replaceState({}, "", url.toString());

    // Fermer le dialogue
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-white">
        <div className="w-max mx-auto bg-slate-100 rounded-full p-3">
          <TimerOff className="text-cblue fill-cblue-light/50 w-8 h-8" />
        </div>
        <DialogTitle className="lg:text-lg uppercase text-center">
          Fin de la session
        </DialogTitle>
        <DialogDescription className="text-center lg:text-lg text-black">
          Vous avez été redirigé parce que la session a pris fin.
        </DialogDescription>
        <Button
          onClick={handleClose}
          className="bg-cblue font-semibold w-full h-10 lg:h-12 lg:text-xl hover:bg-cblue-light transition-all duration-300"
        >
          Fermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
