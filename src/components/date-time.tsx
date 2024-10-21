"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function DateTime() {
  const [currentTime, setCurrentTime] = useState<string>();
  const currentDate = format(new Date(), "MM/dd/yyyy");

  useEffect(() => {
    setCurrentTime(format(new Date(), "HH:mm:ss"));

    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="flex gap-4">
      <span className="hidden lg:block">{currentDate}</span>
      <span>{currentTime}</span>
    </span>
  );
}
