"use client";
import { createClient } from "@/lib/supabase/client";
//import { updateEndSession } from "@/lib/supabase/utils";
import { isThereAnError } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function Timer() {
  const supabase = createClient();
  const [sessionEnded, setSessionEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const endTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const calculateTimeLeft = () => {
    if (!endTimeRef.current) return;

    const now = new Date().getTime();
    const difference = endTimeRef.current.getTime() - now;

    if (difference <= 0) {
      setSessionEnded(true);
      clearInterval(intervalRef.current);
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });

      if (!sessionEnded) {
        //updateEndSession(1); // Use the correct session ID if available
      }
    } else {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }
  };

  useEffect(() => {
    const fetchEndTime = async () => {
      const { data, error } = await supabase.from("duree").select("*").single();

      if (isThereAnError(error, "Error fetching end time: ")) return;
      endTimeRef.current = new Date(data.fin);

      if (data.end_session) {
        setSessionEnded(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      calculateTimeLeft();
      intervalRef.current = setInterval(calculateTimeLeft, 1000);
    };

    fetchEndTime();

    const channel = supabase
      .channel("public:duree")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "duree" },
        (payload) => {
          console.log("Realtime payload received:", payload);
          endTimeRef.current = new Date(payload.new.fin);

          if (!payload.new.end_session) {
            setSessionEnded(false);
            clearInterval(intervalRef.current);
            calculateTimeLeft();
            intervalRef.current = setInterval(calculateTimeLeft, 1000);
          } else {
            setSessionEnded(true);
            clearInterval(intervalRef.current);
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      channel.unsubscribe().then((r) => console.log(r));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (time: number) => String(time).padStart(2, "0");

  return (
    <span>
      {sessionEnded
        ? "00h:00m:00s"
        : `${formatTime(timeLeft.hours)}h:${formatTime(
            timeLeft.minutes
          )}m:${formatTime(timeLeft.seconds)}s`}
    </span>
  );
}
