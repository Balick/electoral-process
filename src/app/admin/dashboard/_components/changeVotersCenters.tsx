"use client";

//import { changeVotersCenter } from "@/lib/supabase/voting";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export default function ChangeVotersCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    //await changeVotersCenter();
    setIsSubmitting(false);
  };

  return (
    <button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="hidden flex items-center justify-center bg-cblue hover:bg-cblue-light text-white hover:text-black transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg"
    >
      {isSubmitting && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
      Charger les centres
    </button>
  );
}
