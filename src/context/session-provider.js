"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(false);
  const [time, setTime] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionResumeCount, setSessionResumeCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const updateLocalStorage = () => {
    localStorage.setItem(
      "vote-session",
      JSON.stringify({
        session,
        time,
        sessionEnded,
        sessionStartTime,
        sessionResumeCount,
        remainingTime,
      })
    );
  };

  useEffect(() => {
    const storedSession = localStorage.getItem("vote-session");
    if (storedSession) {
      console.log(JSON.parse(storedSession));
      // Récupérer l'état de session
      const {
        session,
        time,
        sessionEnded,
        sessionStartTime,
        sessionResumeCount,
        remainingTime,
      } = JSON.parse(storedSession);

      // Définir l'état de session
      setSession(session);
      setTime(time);
      setSessionEnded(sessionEnded);
      setSessionStartTime(sessionStartTime);
      setSessionResumeCount(sessionResumeCount);
      setRemainingTime(remainingTime);
    }
  }, []);

  useEffect(() => {
    if (session) {
      const endTime = sessionStartTime + remainingTime;
      setTime(endTime);

      const interval = setInterval(() => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) {
          clearInterval(interval);
          setSession(false);
          setSessionEnded(true);
          setTime(0);
        } else {
          setTime(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session, sessionStartTime, remainingTime]);

  const startSession = () => {
    const now = Date.now();
    setSession(true);
    setSessionStartTime(now);
    setSessionEnded(false);
    setSessionResumeCount(sessionResumeCount + 1);
    setRemainingTime(1 * 60 * 60 * 1000); // 24 heures en millisecondes
    updateLocalStorage();
  };

  const pauseSession = () => {
    setSession(false);
    setRemainingTime(time);
    updateLocalStorage();
  };

  const resumeSession = () => {
    setSession(true);
    setSessionEnded(false);
    setSessionResumeCount(sessionResumeCount + 1);
    updateLocalStorage();
  };

  useEffect(() => {
    localStorage.setItem(
      "vote-session",
      JSON.stringify({
        session,
        time,
        sessionEnded,
        sessionStartTime,
        sessionResumeCount,
        remainingTime,
      })
    );
  }, [
    session,
    time,
    sessionEnded,
    sessionStartTime,
    sessionResumeCount,
    remainingTime,
  ]);

  return (
    <SessionContext.Provider
      value={{
        session,
        time,
        sessionEnded,
        startSession,
        pauseSession,
        resumeSession,
        remainingTime
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
