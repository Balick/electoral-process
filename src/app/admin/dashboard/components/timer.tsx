"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateEndSession } from "@/lib/supabase/utils";

export default function Timer() {
  const supabase = createClient();
  const [timePassed, setTimePassed] = useState(false);
  const [timePassedNumber, setTimePassedNumber] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [sessionEnded, setSessionEnded] = useState(false);
  const endTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchEndTime = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("duree").select("*").single();

      if (error) {
        console.error("Error fetching end time: ", error.message);
        return;
      }

      const endTime = new Date(data.fin);
      endTimeRef.current = endTime;
      updateTimer();

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateTimer, 1000);

      if (data.end_session) {
        setSessionEnded(true);
        if (!data.end_session) {
          await updateEndSession(data.id);
        }
      }
    };

    fetchEndTime();

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
          const newEndTime = new Date(payload.new.fin);
          endTimeRef.current = newEndTime;
          updateTimer();

          // Arrêter l'intervalle existant et en démarrer un nouveau
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(updateTimer, 1000);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [supabase]);

  const updateTimer = async () => {
    if (!endTimeRef.current) return;

    const now = new Date();
    const diff = endTimeRef.current.getTime() - now.getTime();

    if (diff > 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
      setSessionEnded(false);
    } else {
      setTimePassed(true);
      setTimePassedNumber((prev) => prev + 1);
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      setSessionEnded(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timePassedNumber === 1) {
        await updateEndSession(1);
      }
    }
  };

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <>
      {sessionEnded ? (
        <span>00h:00m:00s</span>
      ) : (
        <>
          {formatTime(timeLeft.hours)}h:{formatTime(timeLeft.minutes)}m:
          {formatTime(timeLeft.seconds)}s
        </>
      )}
    </>
  );
}
