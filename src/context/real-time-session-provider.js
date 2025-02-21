"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RealTimeProvider({ children }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    // Fonction pour vérifier l'état actuel de la session
    const checkSession = async () => {
      const { data, error } = await supabase
        .from("duree")
        .select("end_session")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Erreur lors de la vérification de la session :", error);
        return;
      }

      if (data?.end_session && isMounted) {
        router.replace("/center?sessionEnd=true");
      }
    };

    // Vérifier l'état initial de la session
    checkSession();

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel("public:duree:id=eq.1")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "duree",
          filter: "id=eq.1",
        },
        (payload) => {
          const updatedData = payload.new;
          if (updatedData.end_session && isMounted) {
            router.replace("/center?sessionEnd=true");
          }
        }
      )
      .subscribe();

    // Nettoyage à la désactivation du composant
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return <>{children}</>;
}
