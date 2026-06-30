import { Copy, Trash2, Tag } from "lucide-react";

export default function EntryRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30">
      <input
        className="bg-transparent flex-1 outline-none text-sm"
        defaultValue="Sem descrição"
      />

      <span className="inline-flex items-center gap-1.5 text-xs rounded-full px-2 py-1 bg-muted">
        <span className="size-2 rounded-full bg-blue-500" />
        Projeto
      </span>

      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Tag className="size-3" />
        tag1
      </span>

      <span className="text-xs text-muted-foreground tabular-nums hidden md:inline">
        08:00 - 10:30
      </span>

      <button className="font-mono text-sm tabular-nums w-24 text-right hover:text-primary">
        02:30:00
      </button>

      <button className="btn-ghost p-2" title="Duplicar">
        <Copy className="size-4" />
      </button>

      <button className="btn-ghost p-2 text-destructive" title="Excluir">
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
