"use client"

// context/SessionContext.js
import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(false);
  const [time, setTime] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionResumeCount, setSessionResumeCount] = useState(0);

  useEffect(() => {
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      const { session, time, sessionEnded, sessionStartTime, sessionResumeCount } = JSON.parse(storedSession);
      setSession(session);
      setTime(time);
      setSessionEnded(sessionEnded);
      setSessionStartTime(sessionStartTime);
      setSessionResumeCount(sessionResumeCount);
    }
  }, []);

  useEffect(() => {
    if (session) {
      const endTime = sessionStartTime + 24 * 60 * 60 * 1000; // 24 heures en millisecondes
      setTime(endTime);

      const interval = setInterval(() => {
        const remainingTime = endTime - Date.now();
        if (remainingTime <= 0) {
          clearInterval(interval);
          setSession(false);
          setSessionEnded(true);
          setTime(0);
        } else {
          setTime(remainingTime);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session, sessionStartTime]);

  const startSession = () => {
    const now = Date.now();
    setSession(true);
    setSessionStartTime(now);
    setSessionEnded(false);
    setSessionResumeCount(sessionResumeCount + 1);
  };

  const pauseSession = () => {
    setSession(false);
  };

  const resumeSession = () => {
    setSession(true);
    setSessionEnded(false);
    setSessionResumeCount(sessionResumeCount + 1);
  };

  useEffect(() => {
    localStorage.setItem("session", JSON.stringify({
      session,
      time,
      sessionEnded,
      sessionStartTime,
      sessionResumeCount,
    }));
  }, [session, time, sessionEnded, sessionStartTime, sessionResumeCount]);

  return (
    <SessionContext.Provider value={{ session, time, sessionEnded, startSession, pauseSession, resumeSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
