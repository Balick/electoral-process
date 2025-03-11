"use client";

import Timer from "@/app/admin/dashboard/_components/timer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InteractiveButtons({ slug }: { slug: string }) {
  const [disabled, setIsDisabled] = useState(false);
  const supabase = createClient();

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
        setIsDisabled(data.end_session);
      }
    };

    checkSessionStatus();

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
          setIsDisabled(payload.new.end_session);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [disabled]);

  return (
    <ul className="flex flex-col items-center justify-center w-full gap-2">
      <li className="w-full">
        <p className="text-lg font-semibold text-center uppercase">
          {disabled ? (
            "La session n'est pas encore lancée"
          ) : (
            <>
              Il reste <Timer />
            </>
          )}
        </p>
      </li>
      <li className="w-full">
        <Button disabled={disabled} className="w-full h-auto p-0">
          <Link
            href={disabled ? "" : `/center/${slug}/identification`}
            className="w-full rounded py-4 uppercase font-semibold bg-cblue-light hover:bg-cblue active:bg-cblue active:scale-105 text-lg transition-all duration-300"
          >
            Ouvrir les votes
          </Link>
        </Button>
      </li>
    </ul>
  );
}
