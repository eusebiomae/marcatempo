import { Copy, Trash2, Tag } from "lucide-react";

import type { TimeEntry } from "../../lib/db";

import { useApp } from "../../lib/store";

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

interface Props {
  entry: TimeEntry;
}

export default function EntryRow({ entry }: Props) {
  const deleteEntry = useApp((s) => s.deleteEntry);

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30">
      <div className="flex-1">{entry.description || "Sem descrição"}</div>

      <div className="flex-1">{entry.projectId || "Sem projeto"}</div>
      <div className="flex-1">{entry.clientId || "Sem descrição"}</div>

      <div className="text-xs text-muted-foreground">
        {entry.tags.length > 0 && (
          <span className="flex items-center gap-1">
            <Tag size={14} />

            {entry.tags.join(", ")}
          </span>
        )}
      </div>

      <div className="font-mono w-24 text-right">
        {formatDuration(entry.duration)}
      </div>

      <button className="btn-ghost p-2">
        <Copy size={16} />
      </button>

      <button
        className="btn-ghost p-2 text-destructive"
        onClick={() => deleteEntry(entry.id)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
