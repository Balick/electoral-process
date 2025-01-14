import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

/**
 * Hook personnalisé pour gérer l'état du timer et sa synchronisation avec Supabase
 * @returns Object contenant l'état du timer et la fonction pour le modifier
 */
export function useSessionTimer() {
  const supabase = createClient();
  // État local pour suivre si le timer est en cours d'exécution
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    /**
     * Vérifie l'état initial de la session dans la base de données
     */
    const checkSessionStatus = async () => {
      const { data, error } = await supabase.from("duree").select("*").single();

      if (error) {
        console.error("Error fetching end time: ", error.message);
        return;
      }
      setTimerRunning(!data.end_session);
    };

    // Vérifie l'état initial
    checkSessionStatus();

    // Configure la souscription aux changements en temps réel
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
          // Met à jour l'état local quand la base de données change
          setTimerRunning(!payload.new.end_session);
        }
      )
      .subscribe();

    // Nettoyage de la souscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [timerRunning, supabase]);

  return { timerRunning, setTimerRunning };
}
