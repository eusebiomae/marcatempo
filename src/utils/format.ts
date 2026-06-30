export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function formatHours(totalSeconds: number): string {
  return (totalSeconds / 3600).toFixed(2) + "h";
}

export function formatTime(ts: number, hourFormat: "12h" | "24h" = "24h"): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hourFormat === "12h",
  });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString();
}

export function parseHHMM(value: string): number | null {
  const m = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const h = Number(m[1]),
    min = Number(m[2]),
    s = m[3] ? Number(m[3]) : 0;
  return h * 3600 + min * 60 + s;
}
