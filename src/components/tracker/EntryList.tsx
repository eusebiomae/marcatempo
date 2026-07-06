import { useMemo } from "react";
import { startOfDay } from "date-fns";

import { useApp } from "../../lib/store";

import EntryRow from "./EntryRow";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");

  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");

  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}:${s}`;
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function EntryList() {

  const entries = useApp((s) => s.entries);

  const grouped = useMemo(() => {

    const map = new Map<number, typeof entries>();

    entries.forEach((entry) => {

      const key = startOfDay(entry.startTime).getTime();

      if (!map.has(key)) {

        map.set(key, []);

      }

      map.get(key)!.push(entry);

    });

    return [...map.entries()].sort((a, b) => b[0] - a[0]);

  }, [entries]);

  if (entries.length === 0) {

    return (
      <p className="text-sm text-muted-foreground">
        Nenhum registro encontrado.
      </p>
    );

  }

  return (

    <section className="space-y-6">

      {grouped.map(([day, list]) => {

        const total = list.reduce(
          (sum, entry) => sum + entry.duration,
          0
        );

        return (

          <div key={day}>

            <div className="flex justify-between mb-2 text-sm text-muted-foreground">

              <span>{formatDate(day)}</span>

              <span className="font-mono">
                {formatDuration(total)}
              </span>

            </div>

            <div className="card-surface divide-y divide-border">

              {list.map((entry) => (

                <EntryRow
                  key={entry.id}
                  entry={entry}
                />

              ))}

            </div>

          </div>

        );

      })}

    </section>

  );

}