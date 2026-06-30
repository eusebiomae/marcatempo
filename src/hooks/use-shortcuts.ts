import { useEffect } from "react";
import { useApp } from "@/lib/store";

export function useGlobalShortcuts() {
  const running = useApp((s) => s.running);
  const startTimer = useApp((s) => s.startTimer);
  const stopTimer = useApp((s) => s.stopTimer);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (e.code === "Space" && !inField) {
        e.preventDefault();
        if (running) stopTimer();
        else startTimer({ description: "", tags: [], billable: true });
      }
      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        window.location.assign("/tracker");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, startTimer, stopTimer]);
}
