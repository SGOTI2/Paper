import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TabletContext } from "./TabletContext";
import { cnw } from "../lib/tailwindUtil";

export default function TabletAutoLogoutTimer() {
  const tabletContext = useContext(TabletContext);

  const targetTime = (tabletContext.lastInteraction ?? new Date()).getTime() + 60 * 1000 - 1;

  const [remaining, setRemaining] = useState(
    Math.max(0, targetTime - Date.now())
  );

  const hasCompleted = useRef(false);

  const onCountdownComplete = () => {
    tabletContext.logout()
    hasCompleted.current = false;
    setRemaining(60 * 1000 - 1);
  };

  useEffect(() => {
    const updateCountdown = () => {
      if (!tabletContext.lastInteraction) return;
      const timeLeft = Math.max(0, targetTime - Date.now());

      setRemaining(timeLeft);

      if (timeLeft <= 0 && !hasCompleted.current) {
        hasCompleted.current = true;
        onCountdownComplete();
      }
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const eventCallback = useCallback(() => {
    tabletContext.setLastInteraction(new Date())
  }, []);

  useEffect(() => {
      window.addEventListener("keydown", eventCallback);
      window.addEventListener("mousemove", eventCallback);
      window.addEventListener("mousedown", eventCallback);
      window.addEventListener("touchstart", eventCallback);
      window.addEventListener("touchend", eventCallback);
      return () => {
          window.removeEventListener("keydown", eventCallback);
          window.removeEventListener("mousemove", eventCallback);
          window.removeEventListener("mousedown", eventCallback);
          window.removeEventListener("touchstart", eventCallback);
          window.removeEventListener("touchend", eventCallback);
      };
  }, [eventCallback]);

  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <>
      <p className={cnw("absolute top-0 right-0 p-2 text-gray-500", "text-red-500!", remaining <= 30 * 1000)}>
        00:
        {String(seconds).padStart(2, "0")}
      </p>
    </>
  );
}