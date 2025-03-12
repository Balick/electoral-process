"use client";

import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { resetSession } from "@/lib/supabase/utils";
import { createClient } from "@/lib/supabase/client";

export default function ResetSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const supabase = createClient();

  const submit = async () => {
    setIsLoading(true);
    await resetSession().then(() => setIsLoading(false));
  };

  useEffect(() => {
    const checkSessionStatus = async () => {
      const { data, error } = await supabase
        .from("duree")
        .select("end_session")
        .single();

      if (error) {
        console.error(
          "Erreur lors de la récupération du statut de la session:",
          error
        );
      } else {
        setIsSessionEnded(data.end_session);
      }
    };

    const channel = supabase
      .channel("public:duree")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "duree",
        },
        (payload) => {
          setIsSessionEnded(payload.new.end_session);
        }
      )
      .subscribe();

    checkSessionStatus();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <Button
      type="submit"
      disabled={isLoading || isSessionEnded}
      onClick={submit}
      className="bg-cred hover:bg-cred/70 transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg"
    >
      {isLoading && <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />}
      Réinitialiser la session
    </Button>
  );
}
